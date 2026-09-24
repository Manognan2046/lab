export interface LabExperiment {
    folderName: string;
    fileName: string;
    code: string;
}

const cvLabData: LabExperiment[] = [
    {
        folderName: "CV",
        fileName: "Q1_Filters_and_Edges.py",
        code: `import cv2, numpy as np, matplotlib.pyplot as plt
img = cv2.imread('lena.png', 0)
if img is None: img = np.tile(np.arange(256, dtype=np.uint8), (256, 1))

gb, mb = cv2.GaussianBlur(img, (5, 5), 0), cv2.medianBlur(img, 5)
sx = cv2.Sobel(img, cv2.CV_64F, 1, 0); sy = cv2.Sobel(img, cv2.CV_64F, 0, 1)
sobel = np.uint8(np.clip(np.hypot(sx, sy), 0, 255))
canny, he = cv2.Canny(img, 100, 200), cv2.equalizeHist(img)

imgs = [img, gb, mb, sobel, canny, he]
titles = ['Original', 'Gauss', 'Median', 'Sobel', 'Canny', 'HistEq']

plt.figure(figsize=(12, 6))
for i in range(6):
 plt.subplot(2, 4, i + 1); plt.imshow(imgs[i], 'gray'); plt.title(titles[i]); plt.axis('off')
plt.subplot(2, 4, 7); plt.hist(img.ravel(), 256, [0, 256]); plt.title('Hist Before')
plt.subplot(2, 4, 8); plt.hist(he.ravel(), 256, [0, 256]); plt.title('Hist After')
plt.tight_layout(); plt.savefig('q1.png'); plt.show()`
    },
    {
        folderName: "CV",
        fileName: "Q2_Custom_Convolution.py",
        code: `import cv2, numpy as np, matplotlib.pyplot as plt

img = cv2.imread('flowers.jpg')
if img is None: img = np.random.randint(0, 255, (100, 100, 3), dtype=np.uint8)

k = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]], dtype=np.float32)
p = np.pad(img, ((1, 1), (1, 1), (0, 0)), 'edge')
sharp = np.clip(sum(p[i:i+img.shape[0], j:j+img.shape[1]] * k[i, j] for i in range(3) for j in range(3)), 0, 255).astype(np.uint8)
lap = np.uint8(np.clip(np.abs(cv2.Laplacian(img, cv2.CV_64F)), 0, 255))

ps1, ps2 = cv2.PSNR(img, sharp), cv2.PSNR(img, lap)
print(f"PSNR -> Sharp: {ps1:.2f}dB | Laplacian: {ps2:.2f}dB")

res = [img, sharp, lap]
t = ['Original', f'Sharp ({ps1:.1f}dB)', f'Lap ({ps2:.1f}dB)']

for i in range(3):
 plt.subplot(1, 3, i + 1); plt.imshow(cv2.cvtColor(res[i], cv2.COLOR_BGR2RGB)); plt.title(t[i]); plt.axis('off')
plt.show()`
    },
    {
        folderName: "CV",
        fileName: "Q3_Color_Space_and_KMeans.py",
        code: `import cv2, numpy as np, matplotlib.pyplot as plt

img = cv2.resize(cv2.imread('flowers.jpg') if cv2.imread('flowers.jpg') is not None else np.zeros((100, 100, 3), dtype=np.uint8), (100, 100))
rgb, hsv, lab = cv2.cvtColor(img, cv2.COLOR_BGR2RGB), cv2.cvtColor(img, cv2.COLOR_BGR2HSV), cv2.cvtColor(img, cv2.COLOR_BGR2LAB)

mask = cv2.inRange(hsv, (20, 40, 40), (85, 255, 255))
hsv_seg = cv2.bitwise_and(rgb, rgb, mask=mask)

def km(k):
 _, lbl, ctr = cv2.kmeans(rgb.reshape(-1, 3).astype(np.float32), k, None, (1, 5, 1.0), 3, cv2.KMEANS_RANDOM_CENTERS)
 return np.uint8(ctr)[lbl.flatten()].reshape(rgb.shape)

disp = [*cv2.split(rgb), *cv2.split(hsv), *cv2.split(lab), hsv_seg, km(3), km(5)]
names = ['R','G','B','H','S','V','L','A','B','HSV Mask','K=3','K=5']

plt.figure(figsize=(10, 7))
for i in range(12):
 plt.subplot(3, 4, i + 1); plt.imshow(disp[i], cmap='gray' if i < 9 else None); plt.title(names[i]); plt.axis('off')
plt.tight_layout(); plt.show()`
    },
    {
        folderName: "CV",
        fileName: "Q4_Simple_CNN.py",
        code: `import torch
import torch.nn as nn
import torch.optim as optim
import torchvision
import torchvision.transforms as transforms
import matplotlib.pyplot as plt

torch.set_num_threads(4)
transform = transforms.Compose([transforms.ToTensor(), transforms.Normalize((0.5,), (0.5,))])

trainset = torchvision.datasets.CIFAR10(root='./data', train=True, download=True, transform=transform)
train_sub = torch.utils.data.Subset(trainset, range(1200))
trainloader = torch.utils.data.DataLoader(train_sub, batch_size=64, shuffle=True)

testset = torchvision.datasets.CIFAR10(root='./data', train=False, download=True, transform=transform)
test_sub = torch.utils.data.Subset(testset, range(300))
testloader = torch.utils.data.DataLoader(test_sub, batch_size=64, shuffle=False)

class SimpleCNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(3, 16, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2, 2),
            nn.Conv2d(16, 32, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2, 2)
        )
        self.fc = nn.Sequential(nn.Linear(32 * 8 * 8, 64), nn.ReLU(), nn.Linear(64, 10))
    def forward(self, x):
        return self.fc(self.conv(x).view(x.size(0), -1))

model = SimpleCNN()
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.002)
loss_hist, acc_hist = [], []

for epoch in range(10):
    running_loss, correct, total = 0.0, 0, 0
    for imgs, labels in trainloader:
        optimizer.zero_grad()
        outs = model(imgs)
        loss = criterion(outs, labels)
        loss.backward()
        optimizer.step()
        running_loss += loss.item() * imgs.size(0)
        correct += (outs.argmax(1) == labels).sum().item()
        total += labels.size(0)
    loss_hist.append(running_loss / total)
    acc_hist.append(correct / total)
    print(f"Epoch {epoch+1}/10 - Loss: {loss_hist[-1]:.4f} - Acc: {acc_hist[-1]:.4f}")

correct, total = 0, 0
with torch.no_grad():
    for imgs, labels in testloader:
        correct += (model(imgs).argmax(1) == labels).sum().item()
        total += labels.size(0)
print(f"Test Accuracy: {100 * correct / total:.2f}%")
torch.save(model.state_dict(), 'cifar_cnn.pth')

plt.figure(figsize=(9, 3))
plt.subplot(1, 2, 1); plt.plot(loss_hist); plt.title('Training Loss')
plt.subplot(1, 2, 2); plt.plot(acc_hist); plt.title('Training Accuracy')
plt.tight_layout(); plt.show()`
    },
    {
        folderName: "CV",
        fileName: "Q5_Regularized_CNN.py",
        code: `import torch
import torch.nn as nn
import torch.optim as optim
import torchvision
import torchvision.transforms as transforms
import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay

base_t = transforms.Compose([transforms.ToTensor(), transforms.Normalize((0.5,), (0.5,))])
aug_t = transforms.Compose([
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(10),
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,))
])

class RegularizedCNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(3, 16, 3, padding=1), nn.BatchNorm2d(16), nn.ReLU(), nn.MaxPool2d(2, 2),
            nn.Conv2d(16, 32, 3, padding=1), nn.BatchNorm2d(32), nn.ReLU(), nn.MaxPool2d(2, 2),
            nn.Flatten(),
            nn.Linear(32 * 8 * 8, 64), nn.ReLU(), nn.Dropout(0.3),
            nn.Linear(64, 10)
        )
    def forward(self, x): return self.net(x)

def train_and_eval(t_form):
    train_ds = torchvision.datasets.CIFAR10(root='./data', train=True, download=True, transform=t_form)
    test_ds = torchvision.datasets.CIFAR10(root='./data', train=False, download=True, transform=base_t)
    train_ldr = torch.utils.data.DataLoader(torch.utils.data.Subset(train_ds, range(1000)), batch_size=64, shuffle=True)
    test_ldr = torch.utils.data.DataLoader(torch.utils.data.Subset(test_ds, range(200)), batch_size=64, shuffle=False)
    
    m = RegularizedCNN()
    crit, opt = nn.CrossEntropyLoss(), optim.Adam(m.parameters(), lr=0.002)
    for _ in range(5):
        m.train()
        for x, y in train_ldr:
            opt.zero_grad(); crit(m(x), y).backward(); opt.step()
    
    m.eval()
    preds, targets = [], []
    with torch.no_grad():
        for x, y in test_ldr:
            preds.extend(m(x).argmax(1).numpy())
            targets.extend(y.numpy())
    return (np.array(preds) == np.array(targets)).mean() * 100, preds, targets

acc_noaug, _, _ = train_and_eval(base_t)
acc_aug, preds, targets = train_and_eval(aug_t)
print(f"Accuracy Without Augmentation: {acc_noaug:.2f}% | With Augmentation: {acc_aug:.2f}%")

cm = confusion_matrix(targets, preds)
ConfusionMatrixDisplay(cm).plot()
plt.title("Confusion Matrix (With Augmentation)")
plt.show()`
    },
    {
        folderName: "CV",
        fileName: "Q6_Filter_Visualization.py",
        code: `import torch
import torch.nn as nn
import torchvision
import torchvision.transforms as transforms
import matplotlib.pyplot as plt

class SimpleCNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(3, 16, 3, padding=1)
        self.conv2 = nn.Conv2d(16, 32, 3, padding=1)
        self.pool = nn.MaxPool2d(2, 2)
        self.relu = nn.ReLU()
        self.fc = nn.Linear(32 * 8 * 8, 64)
    def forward(self, x):
        c1 = self.relu(self.conv1(x))
        p1 = self.pool(c1)
        c2 = self.relu(self.conv2(p1))
        p2 = self.pool(c2)
        return self.fc(p2.view(x.size(0), -1)), c1, c2

model = SimpleCNN()
try:
    model.load_state_dict(torch.load('cifar_cnn.pth', map_location='cpu'), strict=False)
except: pass
model.eval()

filters = model.conv1.weight.data
f_min, f_max = filters.min(), filters.max()
filters = (filters - f_min) / (f_max - f_min + 1e-8)

fig, ax = plt.subplots(2, 8, figsize=(10, 3))
for i in range(16):
    r, c = divmod(i, 8)
    ax[r, c].imshow(filters[i].permute(1, 2, 0).numpy())
    ax[r, c].axis('off')
plt.suptitle('Conv1 Layer: 16 Learned Filters')
plt.show()

transform = transforms.Compose([transforms.ToTensor(), transforms.Normalize((0.5,), (0.5,))])
testset = torchvision.datasets.CIFAR10(root='./data', train=False, download=True, transform=transform)
img, _ = testset[0]

with torch.no_grad():
    _, act1, act2 = model(img.unsqueeze(0))

fig, ax = plt.subplots(1, 8, figsize=(10, 2))
for i in range(8):
    ax[i].imshow(act1[0, i].numpy(), cmap='viridis'); ax[i].axis('off')
plt.suptitle('Conv1 Activations (Low-level: edges, corners, colors)')
plt.show()

fig, ax = plt.subplots(1, 8, figsize=(10, 2))
for i in range(8):
    ax[i].imshow(act2[0, i].numpy(), cmap='viridis'); ax[i].axis('off')
plt.suptitle('Conv2 Activations (High-level: parts, textures, context)')
plt.show()`
    },
    {
        folderName: "CV",
        fileName: "Q7_Grad_CAM.py",
        code: `import torch
import torch.nn as nn
import torchvision
import torchvision.transforms as transforms
import numpy as np
import cv2
import matplotlib.pyplot as plt

class SimpleCNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(3, 16, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2, 2),
            nn.Conv2d(16, 32, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2, 2)
        )
        self.fc = nn.Sequential(nn.Linear(32 * 8 * 8, 64), nn.ReLU(), nn.Linear(64, 10))
    def forward(self, x): return self.fc(self.conv(x).view(x.size(0), -1))

model = SimpleCNN()
try:
    model.load_state_dict(torch.load('cifar_cnn.pth', map_location='cpu'), strict=False)
except: pass
model.eval()

transform = transforms.Compose([transforms.ToTensor(), transforms.Normalize((0.5,), (0.5,))])
testset = torchvision.datasets.CIFAR10(root='./data', train=False, download=True, transform=transform)

fig, axes = plt.subplots(3, 2, figsize=(6, 8))
for idx in range(3):
    img_t, _ = testset[idx]
    x = img_t.unsqueeze(0).requires_grad_(True)
    
    features = {'activations': None, 'gradients': None}
    def f_hook(m, inp, out): features['activations'] = out
    def b_hook(m, gi, go): features['gradients'] = go[0]
    
    target_layer = model.conv[3]
    h1 = target_layer.register_forward_hook(f_hook)
    h2 = target_layer.register_full_backward_hook(b_hook)
    
    out = model(x)
    pred_cls = out.argmax(1).item()
    out[0, pred_cls].backward()
    
    weights = features['gradients'].mean(dim=(2, 3), keepdim=True)
    cam = torch.relu((weights * features['activations']).sum(dim=1)).squeeze().detach().numpy()
    cam = cv2.resize(cam, (32, 32))
    cam = (cam - cam.min()) / (cam.max() - cam.min() + 1e-8)
    
    orig = np.clip(img_t.permute(1, 2, 0).numpy() * 0.5 + 0.5, 0, 1)
    heatmap = cv2.applyColorMap(np.uint8(255 * cam), cv2.COLORMAP_JET)
    heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB) / 255.0
    overlay = np.clip(0.6 * orig + 0.4 * heatmap, 0, 1)
    
    axes[idx, 0].imshow(orig); axes[idx, 0].axis('off'); axes[idx, 0].set_title('Original')
    axes[idx, 1].imshow(overlay); axes[idx, 1].axis('off'); axes[idx, 1].set_title(f'Grad-CAM (Cls: {pred_cls})')
    h1.remove(); h2.remove()

plt.tight_layout()
plt.show()`
    },
    {
        folderName: "CV",
        fileName: "Q8_Feature_Matching.py",
        code: `import cv2
import numpy as np
import matplotlib.pyplot as plt

img1 = cv2.imread('img1.jpg', cv2.IMREAD_GRAYSCALE)
img2 = cv2.imread('img2.jpg', cv2.IMREAD_GRAYSCALE)

if img1 is None or img2 is None:
    img1 = np.zeros((200, 200), dtype=np.uint8)
    cv2.rectangle(img1, (40, 40), (140, 140), 255, -1)
    cv2.circle(img1, (90, 90), 30, 0, -1)
    M = cv2.getRotationMatrix2D((100, 100), 25, 1.0)
    img2 = cv2.warpAffine(img1, M, (200, 200))

sift = cv2.SIFT_create(nfeatures=500)
kp1_s, des1_s = sift.detectAndCompute(img1, None)
kp2_s, des2_s = sift.detectAndCompute(img2, None)
bf_sift = cv2.BFMatcher(cv2.NORM_L2)
matches_s = bf_sift.knnMatch(des1_s, des2_s, k=2)
good_sift = [m for m, n in matches_s if m.distance < 0.75 * n.distance]

orb = cv2.ORB_create(nfeatures=500)
kp1_o, des1_o = orb.detectAndCompute(img1, None)
kp2_o, des2_o = orb.detectAndCompute(img2, None)
bf_orb = cv2.BFMatcher(cv2.NORM_HAMMING)
matches_o = bf_orb.knnMatch(des1_o, des2_o, k=2)
good_orb = [m for m, n in matches_o if len((m, n)) == 2 and m.distance < 0.75 * n.distance]

img_s = cv2.drawMatches(img1, kp1_s, img2, kp2_s, good_sift[:30], None, flags=2)
img_o = cv2.drawMatches(img1, kp1_o, img2, kp2_o, good_orb[:30], None, flags=2)

print(f"SIFT good matches: {len(good_sift)}")
print(f"ORB good matches: {len(good_orb)}")
print("SIFT provides better rotation/scale invariance; ORB runs faster.")

plt.figure(figsize=(12, 6))
plt.subplot(2, 1, 1); plt.imshow(img_s); plt.title(f'SIFT Matches ({len(good_sift)})'); plt.axis('off')
plt.subplot(2, 1, 2); plt.imshow(img_o); plt.title(f'ORB Matches ({len(good_orb)})'); plt.axis('off')
plt.tight_layout(); plt.show()`
    },
    {
        folderName: "CV",
        fileName: "Q9_Image_Retrieval.py",
        code: `import torch
import torchvision
import torchvision.transforms as transforms
import numpy as np
import cv2
import matplotlib.pyplot as plt
from sklearn.cluster import MiniBatchKMeans
from scipy.spatial.distance import cdist

transform = transforms.Compose([transforms.Resize((64, 64)), transforms.ToTensor()])
stl10 = torchvision.datasets.STL10(root='./data', split='train', download=True, transform=transform)

data, counts = [], {i: 0 for i in range(5)}
for img, lbl in stl10:
    if lbl < 5 and counts[lbl] < 20:
        data.append((np.clip(img.permute(1, 2, 0).numpy() * 255, 0, 255)).astype(np.uint8))
        counts[lbl] += 1
    if sum(counts.values()) == 100: break

sift = cv2.SIFT_create(nfeatures=100)
descriptors_list = []
for im in data:
    gray = cv2.cvtColor(im, cv2.COLOR_RGB2GRAY)
    _, des = sift.detectAndCompute(gray, None)
    descriptors_list.append(des if des is not None else np.zeros((1, 128), dtype=np.float32))

all_des = np.vstack(descriptors_list)
kmeans = MiniBatchKMeans(n_clusters=20, random_state=42, batch_size=100, n_init=1).fit(all_des)

bow_hist = np.zeros((100, 20))
for i, des in enumerate(descriptors_list):
    preds = kmeans.predict(des)
    for p in preds: bow_hist[i, p] += 1
    norm = np.linalg.norm(bow_hist[i])
    if norm > 0: bow_hist[i] /= norm

resnet = torchvision.models.resnet18(weights='DEFAULT')
resnet.fc = torch.nn.Identity()
resnet.eval()

t_norm = transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
tensors = torch.stack([t_norm(transforms.ToTensor()(im)) for im in data])
with torch.no_grad():
    deep_feats = resnet(tensors).numpy()

query_idx = 0
sift_top5 = np.argsort(cdist(bow_hist[[query_idx]], bow_hist, metric='euclidean')[0])[1:6]
resnet_top5 = np.argsort(cdist(deep_feats[[query_idx]], deep_feats, metric='euclidean')[0])[1:6]

fig, axes = plt.subplots(3, 5, figsize=(10, 5))
axes[0, 2].imshow(data[query_idx]); axes[0, 2].set_title("Query")
for i in range(5):
    axes[0, i].axis('off')
    axes[1, i].imshow(data[sift_top5[i]]); axes[1, i].set_title(f"SIFT #{i+1}"); axes[1, i].axis('off')
    axes[2, i].imshow(data[resnet_top5[i]]); axes[2, i].set_title(f"ResNet #{i+1}"); axes[2, i].axis('off')
plt.tight_layout()
plt.show()`
    },
    {
        folderName: "CV",
        fileName: "Q10_Fine_Tuning.py",
        code: `import torch
import torch.nn as nn
import torch.optim as optim
import torchvision
import torchvision.transforms as transforms
import time
import matplotlib.pyplot as plt

transform = transforms.Compose([
    transforms.Resize((32, 32)),
    transforms.Grayscale(num_output_channels=3),
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,))
])

trainset = torchvision.datasets.FashionMNIST(root='./data', train=True, download=True, transform=transform)
trainloader = torch.utils.data.DataLoader(torch.utils.data.Subset(trainset, range(500)), batch_size=64, shuffle=True)
testset = torchvision.datasets.FashionMNIST(root='./data', train=False, download=True, transform=transform)
testloader = torch.utils.data.DataLoader(torch.utils.data.Subset(testset, range(150)), batch_size=64, shuffle=False)

def run_experiment(freeze_backbone=True):
    m = torchvision.models.resnet18(weights='DEFAULT')
    for p in m.parameters(): p.requires_grad = False
    if not freeze_backbone:
        for p in m.layer4.parameters(): p.requires_grad = True
    m.fc = nn.Linear(m.fc.in_features, 10)
    
    crit = nn.CrossEntropyLoss()
    opt = optim.Adam(filter(lambda p: p.requires_grad, m.parameters()), lr=0.003)
    
    start = time.time()
    for _ in range(5):
        m.train()
        for x, y in trainloader:
            opt.zero_grad(); crit(m(x), y).backward(); opt.step()
    elapsed = time.time() - start
    
    m.eval()
    corr = 0
    with torch.no_grad():
        for x, y in testloader:
            corr += (m(x).argmax(1) == y).sum().item()
    return (corr / 150) * 100, elapsed

acc_a, t_a = run_experiment(freeze_backbone=True)
acc_b, t_b = run_experiment(freeze_backbone=False)

plt.figure(figsize=(7, 3))
plt.subplot(1, 2, 1); plt.bar(['A (Frozen)', 'B (Fine-tune)'], [acc_a, acc_b], color=['navy', 'teal'])
plt.ylabel('Test Accuracy (%)'); plt.title('Accuracy')
plt.subplot(1, 2, 2); plt.bar(['A (Frozen)', 'B (Fine-tune)'], [t_a, t_b], color=['navy', 'teal'])
plt.ylabel('Time (sec)'); plt.title('Training Time')
plt.tight_layout(); plt.show()`
    },
    {
        folderName: "CV",
        fileName: "Q11_YOLO_Detection.py",
        code: `import torch
import torchvision
import urllib.request
import cv2
import numpy as np
import matplotlib.pyplot as plt
from ultralytics import YOLO

resnet = torchvision.models.resnet18(weights='DEFAULT')
resnet.fc = torch.nn.Linear(resnet.fc.in_features, 10)
resnet.eval()
print("ResNet18 Fine-tuning pipeline initialized.")

yolo = YOLO('yolov8n.pt')
urls = [
    "https://raw.githubusercontent.com/ultralytics/ultralytics/main/ultralytics/assets/bus.jpg",
    "https://raw.githubusercontent.com/ultralytics/ultralytics/main/ultralytics/assets/zidane.jpg"
]

images = []
for i, u in enumerate(urls):
    fn = f"scene_{i}.jpg"
    try: urllib.request.urlretrieve(u, fn)
    except: pass
    im = cv2.imread(fn)
    if im is not None: images.append(cv2.resize(im, (320, 320)))

while len(images) < 5:
    canvas = np.zeros((320, 320, 3), dtype=np.uint8)
    cv2.putText(canvas, f"Scene {len(images)+1}", (40, 160), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
    images.append(canvas)

fig, axes = plt.subplots(1, 5, figsize=(15, 3))
for i in range(5):
    res = yolo(images[i], verbose=False)[0]
    axes[i].imshow(cv2.cvtColor(res.plot(), cv2.COLOR_BGR2RGB))
    axes[i].set_title(f"Boxes: {len(res.boxes)}")
    axes[i].axis('off')
plt.tight_layout()
plt.show()`
    },
    {
        folderName: "CV",
        fileName: "Q12_SimCLR_Pipeline.py",
        code: `import torch
import torch.nn as nn
import torchvision
import torchvision.transforms as transforms
from torch.utils.data import DataLoader, Subset
from sklearn.manifold import TSNE
import matplotlib.pyplot as plt
import numpy as np

class SimCLRAugment:
    def __init__(self):
        self.aug = transforms.Compose([
            transforms.RandomResizedCrop(32, scale=(0.8, 1.0)),
            transforms.RandomHorizontalFlip(),
            transforms.ToTensor(),
            transforms.Normalize((0.5,), (0.5,))
        ])
    def __call__(self, x): return self.aug(x), self.aug(x)

class SimpleSimCLR(nn.Module):
    def __init__(self):
        super().__init__()
        self.enc = nn.Sequential(
            nn.Conv2d(3, 16, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2, 2),
            nn.Conv2d(16, 32, 3, padding=1), nn.ReLU(), nn.AdaptiveAvgPool2d((1, 1)),
            nn.Flatten()
        )
        self.proj = nn.Sequential(nn.Linear(32, 32), nn.ReLU(), nn.Linear(32, 16))
    def forward(self, x):
        h = self.enc(x)
        return h, nn.functional.normalize(self.proj(h), dim=1)

def nt_xent_loss(z1, z2, temp=0.5):
    z = torch.cat([z1, z2], dim=0)
    sim = torch.mm(z, z.t()) / temp
    sim.fill_diagonal_(-float('inf'))
    labels = torch.cat([torch.arange(len(z1)) + len(z1), torch.arange(len(z1))])
    return nn.functional.cross_entropy(sim, labels)

train_raw = torchvision.datasets.STL10(root='./data', split='train', download=True)
train_sub = Subset(train_raw, range(200))

class PairDS(torch.utils.data.Dataset):
    def __init__(self, subset, tf): self.sub, self.tf = subset, tf
    def __len__(self): return len(self.sub)
    def __getitem__(self, idx): return self.tf(self.sub[idx][0])

loader = DataLoader(PairDS(train_sub, SimCLRAugment()), batch_size=32, shuffle=True)
model = SimpleSimCLR()
opt = torch.optim.Adam(model.parameters(), lr=0.003)

for epoch in range(10):
    model.train()
    for x1, x2 in loader:
        opt.zero_grad()
        _, z1 = model(x1)
        _, z2 = model(x2)
        loss = nt_xent_loss(z1, z2)
        loss.backward()
        opt.step()

test_tf = transforms.Compose([transforms.Resize((32, 32)), transforms.ToTensor(), transforms.Normalize((0.5,), (0.5,))])
testset = torchvision.datasets.STL10(root='./data', split='test', download=True, transform=test_tf)
test_loader = DataLoader(Subset(testset, range(200)), batch_size=32, shuffle=False)

embs, labels = [], []
model.eval()
with torch.no_grad():
    for x, y in test_loader:
        h, _ = model(x)
        embs.append(h.numpy())
        labels.append(y.numpy())

embs, labels = np.concatenate(embs), np.concatenate(labels)
tsne = TSNE(n_components=2, random_state=42, perplexity=15).fit_transform(embs)

plt.figure(figsize=(7, 5))
scatter = plt.scatter(tsne[:, 0], tsne[:, 1], c=labels, cmap='tab10', alpha=0.8, s=25)
plt.colorbar(scatter, label='Class Label')
plt.title("t-SNE of SimCLR Embeddings (Fast CPU)")
plt.show()`
    }
];

export const allLabs: Record<string, LabExperiment[]> = {
    cv: cvLabData
};

export interface LabExperiment {
  folderName: string;
  fileName: string;
  code: string;
}

const dlLabData: LabExperiment[] = [
  {
    folderName: "DL",
    fileName: "Q1_Linear_Regression_Single.py",
    code: `import numpy as np
import tensorflow as tf
from tensorflow import keras
from keras.datasets import boston_housing
import matplotlib.pyplot as plt

# Load Boston Housing dataset
(x_train, y_train), (x_test, y_test) = boston_housing.load_data()

# Normalize features
mean = x_train.mean(axis=0)
std = x_train.std(axis=0)
x_train = (x_train - mean) / std
x_test = (x_test - mean) / std

# Build Linear Regression Model
model = keras.Sequential([
    keras.layers.Dense(1, input_shape=(13,))
])

# Compile Model
model.compile(
    optimizer='sgd',
    loss='mean_squared_error',
    metrics=['mae'])

# Train Model
history = model.fit(
    x_train,
    y_train,
    epochs=100,
    validation_split=0.2,
    verbose=1)

# Evaluate Model
loss, mae = model.evaluate(x_test, y_test, verbose=0)
print("\\nTest Loss:", loss)
print("Mean Absolute Error:", mae)

# Make Predictions
predictions = model.predict(x_test)
print("\\nSample Predictions:")
for i in range(5):
    print(f"Actual: {y_test[i]:.2f}  Predicted: {predictions[i][0]:.2f}")

# Graph 2: Actual vs Predicted Prices
plt.figure(figsize=(8, 6))
plt.scatter(y_test, predictions)
plt.plot(
    [y_test.min(), y_test.max()],
    [y_test.min(), y_test.max()],
    'r--')
plt.xlabel('Actual House Price')
plt.ylabel('Predicted House Price')
plt.title('Actual vs Predicted House Prices')
plt.grid(True)
plt.show()`
  },
  {
    folderName: "DL",
    fileName: "Q2_Linear_Regression_Multiple.py",
    code: `import numpy as np
import tensorflow as tf
from tensorflow import keras
from keras.datasets import boston_housing
import matplotlib.pyplot as plt

# Load Boston Housing dataset
(x_train, y_train), (x_test, y_test) = boston_housing.load_data()

# Normalize features
mean = x_train.mean(axis=0)
std = x_train.std(axis=0)
x_train = (x_train - mean) / std
x_test = (x_test - mean) / std

# Build Linear Regression Model
model = keras.Sequential([
    keras.layers.Dense(1, input_shape=(13,))
])

# Compile Model
model.compile(
    optimizer='sgd',
    loss='mean_squared_error',
    metrics=['mae'])

# Train Model
history = model.fit(
    x_train,
    y_train,
    epochs=100,
    validation_split=0.2,
    verbose=1)

# Evaluate Model
loss, mae = model.evaluate(x_test, y_test, verbose=0)
print("\\nTest Loss:", loss)
print("Mean Absolute Error:", mae)

# Make Predictions
predictions = model.predict(x_test)
print("\\nSample Predictions:")
for i in range(5):
    print(f"Actual: {y_test[i]:.2f}  Predicted: {predictions[i][0]:.2f}")

# Graph 2: Actual vs Predicted Prices
plt.figure(figsize=(8, 6))
plt.scatter(y_test, predictions)
plt.plot(
    [y_test.min(), y_test.max()],
    [y_test.min(), y_test.max()],
    'r--')
plt.xlabel('Actual House Price')
plt.ylabel('Predicted House Price')
plt.title('Actual vs Predicted House Prices')
plt.grid(True)
plt.show()`
  },
  {
    folderName: "DL",
    fileName: "Q3_Speech_to_Text.py",
    code: `# pip install SpeechRecognition
import speech_recognition as sr

recognizer = sr.Recognizer()
with sr.AudioFile('sample.wav') as source:
    audio = recognizer.record(source)

try:
    text = recognizer.recognize_google(audio)
    print("Recognized Speech:", text)
except sr.UnknownValueError:
    print("Could not understand audio")
except sr.RequestError:
    print("Could not reach recognition service")`
  },
  {
    folderName: "DL",
    fileName: "Q4_Time_Series_LSTM.py",
    code: `import numpy as np
import tensorflow as tf
from tensorflow import keras
from keras.models import Sequential
from keras.layers import LSTM, Dense
import matplotlib.pyplot as plt

# Generate dummy time series data: y = x + some noise
x = np.array([i for i in range(100)])
y = x + np.random.normal(0, 1, 100)

# Prepare the data as sequences
def create_dataset(data, step=5):
    X, Y = [], []
    for i in range(len(data) - step):
        X.append(data[i:i + step])
        Y.append(data[i + step])
    return np.array(X), np.array(Y)

X, Y = create_dataset(y)

# Reshape input to be [samples, time steps, features]
X = X.reshape((X.shape[0], X.shape[1], 1))

# Build LSTM model
model = Sequential([
    LSTM(50, activation='relu', input_shape=(X.shape[1], 1)),
    Dense(1)
])
model.compile(optimizer='adam', loss='mse')

# Train model
model.fit(X, Y, epochs=100, verbose=0)

# Make predictions
predicted = model.predict(X, verbose=0)

# Plot actual vs predicted
plt.plot(Y, label='Actual')
plt.plot(predicted, label='Predicted')
plt.title("LSTM Time-Series Forecasting")
plt.xlabel("Time Step")
plt.ylabel("Value")
plt.legend()
plt.grid()
plt.show()`
  },
  {
    folderName: "DL",
    fileName: "Q5_Image_Captioning_LSTM.py",
    code: `import numpy as np
import matplotlib.pyplot as plt
from tensorflow.keras.applications.inception_v3 import InceptionV3, preprocess_input
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import Model, load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pickle

# Load the InceptionV3 model for feature extraction
base_model = InceptionV3(weights='imagenet')
cnn_model = Model(inputs=base_model.input, outputs=base_model.layers[-2].output)

# Function to preprocess the image
def preprocess_img(img_path):
    img = image.load_img(img_path, target_size=(299, 299))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    return img_array

# Function to encode image to feature vector
def encode_image(img_path):
    img = preprocess_img(img_path)
    fea_vec = cnn_model.predict(img, verbose=0)
    fea_vec = np.reshape(fea_vec, fea_vec.shape[1])
    return fea_vec

# Load tokenizer and trained caption generation model
with open("tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

model = load_model("image_caption_model.h5")
max_length = 34

# Function to generate caption using greedy search
def predict_caption(photo):
    in_text = 'startseq'
    for i in range(max_length):
        sequence = tokenizer.texts_to_sequences([in_text])[0]
        sequence = pad_sequences([sequence], maxlen=max_length)
        yhat = model.predict([np.expand_dims(photo, axis=0), sequence], verbose=0)
        yhat = np.argmax(yhat)
        word = None
        for w, index in tokenizer.word_index.items():
            if index == yhat:
                word = w
                break
        if word is None:
            break
        in_text += ' ' + word
        if word == 'endseq':
            break
    return in_text.replace('startseq', '').replace('endseq', '').strip()

# Run the full pipeline
img_path = "sample.jpg"  # replace with your actual image file
photo = encode_image(img_path)
caption = predict_caption(photo)
print("Predicted Caption:", caption)

# Display the image
img_display = image.load_img(img_path)
plt.imshow(img_display)
plt.axis('off')
plt.title(caption)
plt.show()`
  },
  {
    folderName: "DL",
    fileName: "Q6_Character_Recognition_CNN.py",
    code: `from tensorflow import keras
from keras.datasets import mnist
from keras.models import Sequential
from keras.layers import Conv2D, MaxPooling2D, Flatten, Dense
from keras.utils import to_categorical
import matplotlib.pyplot as plt

# Load MNIST dataset
(X_train, y_train), (X_test, y_test) = mnist.load_data()

# Reshape to fit CNN input and normalize
X_train = X_train.reshape(-1, 28, 28, 1).astype('float32') / 255.0
X_test = X_test.reshape(-1, 28, 28, 1).astype('float32') / 255.0

# One-hot encode labels
y_train = to_categorical(y_train, 10)
y_test = to_categorical(y_test, 10)

# Build the CNN model
model = Sequential([
    Conv2D(32, kernel_size=(3, 3), activation='relu', input_shape=(28, 28, 1)),
    MaxPooling2D(pool_size=(2, 2)),
    Conv2D(64, kernel_size=(3, 3), activation='relu'),
    MaxPooling2D(pool_size=(2, 2)),
    Flatten(),
    Dense(128, activation='relu'),
    Dense(10, activation='softmax')
])

# Compile model
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy'])

# Train model
history = model.fit(
    X_train,
    y_train,
    epochs=5,
    batch_size=128,
    validation_split=0.2)

# Evaluate model
test_loss, test_acc = model.evaluate(X_test, y_test)
print(f"Test Accuracy: {test_acc * 100:.2f}%")

# Plot accuracy
plt.plot(history.history['accuracy'], label='Train Accuracy')
plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
plt.title('Character Recognition Accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()
plt.grid(True)
plt.show()`
  },
  {
    folderName: "DL",
    fileName: "Q7_Image_Captioning_CNN.py",
    code: `import numpy as np
import matplotlib.pyplot as plt
from tensorflow import keras
from keras.models import Sequential
from keras.layers import Conv2D, MaxPooling2D, Flatten, Dense
from keras.preprocessing import image

# Suppose we have 4 "caption" labels (classes)
class_names = ['a cat', 'a dog', 'a flower', 'a football']

# Define the CNN model
model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(64, 64, 3)),
    MaxPooling2D(pool_size=(2, 2)),
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D(pool_size=(2, 2)),
    Flatten(),
    Dense(128, activation='relu'),
    Dense(len(class_names), activation='softmax')
])

# Compile model
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy'])

# NOTE: Training skipped (for demo purposes)

# Load and preprocess test image
img_path = 'sample.png'  # Replace with actual image
img = image.load_img(img_path, target_size=(64, 64))
img_array = image.img_to_array(img)
img_array = np.expand_dims(img_array, axis=0) / 255.0

# Simulated prediction (since model is not trained)
# prediction = model.predict(img_array)
prediction = np.array([[0.1, 0.05, 0.05, 0.8]])

# Get predicted class
predicted_class = np.argmax(prediction)
caption = class_names[predicted_class]
print("Predicted Caption:", caption)

# Display image
plt.imshow(img)
plt.axis('off')
plt.title(caption)
plt.show()`
  },
  {
    folderName: "DL",
    fileName: "Q8_RNN_vs_CNN_MNIST.py",
    code: `import tensorflow as tf
from keras.datasets import mnist
from keras.models import Sequential
from keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, SimpleRNN
from keras.utils import to_categorical

# Load and preprocess MNIST
(X_train, y_train), (X_test, y_test) = mnist.load_data()
X_train_cnn = X_train.reshape(-1, 28, 28, 1).astype('float32') / 255.0
X_test_cnn = X_test.reshape(-1, 28, 28, 1).astype('float32') / 255.0

# One-hot encoding
y_train = to_categorical(y_train, 10)
y_test = to_categorical(y_test, 10)

# CNN Model
cnn_model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1)),
    MaxPooling2D(pool_size=(2, 2)),
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D(pool_size=(2, 2)),
    Flatten(),
    Dense(128, activation='relu'),
    Dense(10, activation='softmax')
])

# Compile model
cnn_model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy'])

# Train model
cnn_model.fit(
    X_train_cnn,
    y_train,
    epochs=5,
    batch_size=128,
    validation_split=0.2)

# Evaluate model
cnn_test_loss, cnn_test_acc = cnn_model.evaluate(X_test_cnn, y_test)
print(f"CNN Accuracy: {cnn_test_acc * 100:.2f}%")

# Reshape MNIST data for RNN: treat each row as a time step
X_train_rnn = X_train.reshape(-1, 28, 28) / 255.0
X_test_rnn = X_test.reshape(-1, 28, 28) / 255.0

# RNN Model
rnn_model = Sequential([
    SimpleRNN(128, input_shape=(28,28), activation='tanh'),
    Dense(10, activation='softmax')
])
rnn_model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
rnn_model.fit(X_train_rnn, y_train, epochs=5, batch_size=128, validation_split=0.2)
rnn_test_loss, rnn_test_acc = rnn_model.evaluate(X_test_rnn, y_test)
print(f"RNN Accuracy: {rnn_test_acc*100:.2f}%")`
  },
  {
    folderName: "DL",
    fileName: "Q9_YOLO_Dog_Detection.py",
    code: `# !pip install ultralytics
from ultralytics import YOLO
import cv2
import numpy as np

# Method 1: Ultralytics YOLOv8
try:
    model = YOLO('yolov8n.pt')
    results = model("dog.jpg")
    results[0].show()
    results[0].save(filename="dog_detected.jpg")
    print("Detection completed. Output saved as dog_detected.jpg.")
except Exception as e:
    print("YOLOv8 Error:", e)

# Method 2: OpenCV DNN (YOLOv3)
try:
    net = cv2.dnn.readNet("yolov3.weights", "yolov3.cfg")
    with open("coco.names", "r") as f:
        classes = [line.strip() for line in f.readlines()]
    img = cv2.imread("dog.jpg")
    height, width, _ = img.shape
    blob = cv2.dnn.blobFromImage(img, 1/255.0, (416, 416), swapRB=True, crop=False)
    net.setInput(blob)
    layer_names = net.getUnconnectedOutLayersNames()
    outputs = net.forward(layer_names)
    
    boxes, confidences, class_ids = [], [], []
    for output in outputs:
        for detection in output:
            scores = detection[5:]
            class_id = np.argmax(scores)
            confidence = scores[class_id]
            if confidence > 0.5 and classes[class_id] == "dog":
                center_x, center_y = int(detection[0] * width), int(detection[1] * height)
                w, h = int(detection[2] * width), int(detection[3] * height)
                x, y = int(center_x - w / 2), int(center_y - h / 2)
                boxes.append([x, y, w, h])
                confidences.append(float(confidence))
                class_ids.append(class_id)
                
    indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)
    for i in indexes.flatten():
        x, y, w, h = boxes[i]
        label = f"{classes[class_ids[i]]} {confidences[i]:.2f}"
        cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
        cv2.putText(img, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
    cv2.imwrite("dog_detected_v3.jpg", img)
except Exception as e:
    print("YOLOv3 Error:", e)`
  },
  {
    folderName: "DL",
    fileName: "Q10_GAN_MNIST.py",
    code: `import numpy as np
import matplotlib.pyplot as plt
from tensorflow import keras
from keras.layers import Dense, Reshape, Flatten, LeakyReLU, Input
from keras.models import Sequential, Model
from keras.datasets import mnist

# Load and preprocess MNIST dataset
(X_train, _), (_, _) = mnist.load_data()
X_train = (X_train.astype(np.float32) - 127.5) / 127.5
X_train = X_train.reshape(-1, 28 * 28)

# Generator
def build_generator():
    model = Sequential([
        Dense(128, input_dim=100),
        LeakyReLU(0.2),
        Dense(784, activation='tanh'),
        Reshape((28, 28))
    ])
    return model

# Discriminator
def build_discriminator():
    model = Sequential([
        Flatten(input_shape=(28, 28)),
        Dense(128),
        LeakyReLU(0.2),
        Dense(1, activation='sigmoid')
    ])
    return model

generator = build_generator()
discriminator = build_discriminator()
discriminator.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

z = Input(shape=(100,))
img = generator(z)
discriminator.trainable = False
validity = discriminator(img)
combined = Model(z, validity)
combined.compile(optimizer='adam', loss='binary_crossentropy')

epochs, batch_size, sample_interval = 4, 128, 2

for epoch in range(1, epochs + 1):
    idx = np.random.randint(0, X_train.shape[0], batch_size)
    real_imgs = X_train[idx].reshape(-1, 28, 28)
    noise = np.random.normal(0, 1, (batch_size, 100))
    fake_imgs = generator.predict(noise, verbose=0)
    real, fake = np.ones((batch_size, 1)), np.zeros((batch_size, 1))
    
    d_loss_real = discriminator.train_on_batch(real_imgs, real)
    d_loss_fake = discriminator.train_on_batch(fake_imgs, fake)
    d_loss = 0.5 * np.add(d_loss_real, d_loss_fake)
    
    noise = np.random.normal(0, 1, (batch_size, 100))
    g_loss = combined.train_on_batch(noise, real)
    
    if epoch % sample_interval == 0:
        print(f"{epoch} [D loss: {d_loss[0]:.4f}, acc: {100*d_loss[1]:.2f}%] [G loss: {g_loss:.4f}]")
        gen_img = generator.predict(np.random.normal(0, 1, (1, 100)), verbose=0)
        plt.imshow(gen_img[0], cmap='gray')
        plt.title(f"Epoch {epoch}")
        plt.axis('off')
        plt.show()`
  },
  {
    folderName: "DL",
    fileName: "Q11_Vision_Transformer.py",
    code: `from transformers import ViTImageProcessor, ViTForImageClassification
from PIL import Image
import torch
import matplotlib.pyplot as plt

# Load image and convert to RGB
image = Image.open("/content/1.jpg").convert("RGB")
plt.imshow(image)
plt.axis('off')
plt.title("Input Image")
plt.show()

# Load model
processor = ViTImageProcessor.from_pretrained('google/vit-base-patch16-224')
model = ViTForImageClassification.from_pretrained('google/vit-base-patch16-224')

# Preprocess
inputs = processor(images=image, return_tensors="pt")

# Inference
with torch.no_grad():
    outputs = model(**inputs)
logits = outputs.logits
predicted_class_idx = logits.argmax(-1).item()
label = model.config.id2label[predicted_class_idx]
print("Predicted Tag:", label)`
  },
  {
    folderName: "DL",
    fileName: "Q12_Avg_Pooling_Convolution.py",
    code: `import tensorflow as tf
import numpy as np

# Example input: a 4x4 image with 1 channel
input_data = np.array([
    [[1], [2], [3], [4]],
    [[5], [6], [7], [8]],
    [[9], [10], [11], [12]],
    [[13], [14], [15], [16]]], dtype=np.float32)
input_tensor = tf.constant(input_data.reshape(1, 4, 4, 1))

# Define a kernel of size 2x2 with all 1s
kernel = tf.constant([[[[1.0]], [[1.0]]], [[[1.0]], [[1.0]]]])
conv = tf.nn.conv2d(input=input_tensor, filters=kernel, strides=[1, 2, 2, 1], padding='VALID')
avg_pooled = conv / 4.0

print("Input:\\n", input_tensor.numpy().squeeze())
print("\\nAverage Pooled Output via Convolution:\\n", avg_pooled.numpy().squeeze())`
  },
  {
    folderName: "DL",
    fileName: "Q13_LeNet_BatchNormalization.py",
    code: `from tensorflow import keras
from keras.datasets import mnist
from keras.models import Sequential
from keras.layers import (Conv2D, AveragePooling2D, Flatten, Dense, BatchNormalization, Activation)
from keras.utils import to_categorical

(x_train, y_train), (x_test, y_test) = mnist.load_data()
x_train = x_train.reshape(-1, 28, 28, 1).astype('float32') / 255.0
x_test = x_test.reshape(-1, 28, 28, 1).astype('float32') / 255.0
y_train, y_test = to_categorical(y_train, 10), to_categorical(y_test, 10)

model = Sequential()
model.add(Conv2D(6, kernel_size=(5, 5), padding='same', input_shape=(28, 28, 1)))
model.add(BatchNormalization())
model.add(Activation('relu'))
model.add(AveragePooling2D(pool_size=(2, 2), strides=2))
model.add(Conv2D(16, kernel_size=(5, 5)))
model.add(BatchNormalization())
model.add(Activation('relu'))
model.add(AveragePooling2D(pool_size=(2, 2), strides=2))
model.add(Flatten())
model.add(Dense(120))
model.add(BatchNormalization())
model.add(Activation('relu'))
model.add(Dense(84))
model.add(BatchNormalization())
model.add(Activation('relu'))
model.add(Dense(10, activation='softmax'))

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
model.fit(x_train, y_train, epochs=5, batch_size=128, validation_split=0.2)
loss, accuracy = model.evaluate(x_test, y_test)
print(f"Test Accuracy: {accuracy * 100:.2f}%")`
  },
  {
    folderName: "DL",
    fileName: "Q14_ResNet.py",
    code: `from tensorflow import keras
from keras import layers, models
from keras.datasets import cifar10
from keras.utils import to_categorical

(x_train, y_train), (x_test, y_test) = cifar10.load_data()
x_train, y_train = x_train[:500] / 255.0, to_categorical(y_train[:500], 10)
x_test, y_test = x_test[:100] / 255.0, to_categorical(y_test[:100], 10)

def mini_res_block(x, filters):
    shortcut = x
    x = layers.Conv2D(filters, 3, padding='same')(x)
    x = layers.BatchNormalization()(x)
    x = layers.ReLU()(x)
    x = layers.Conv2D(filters, 3, padding='same')(x)
    x = layers.BatchNormalization()(x)
    x = layers.Add()([x, shortcut])
    return layers.ReLU()(x)

def build_mini_resnet():
    inputs = layers.Input(shape=(32, 32, 3))
    x = layers.Conv2D(16, 3, padding='same')(inputs)
    x = layers.BatchNormalization()(x)
    x = layers.ReLU()(x)
    x = mini_res_block(x, 16)
    x = layers.GlobalAveragePooling2D()(x)
    outputs = layers.Dense(10, activation='softmax')(x)
    return models.Model(inputs, outputs)

model = build_mini_resnet()
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
model.fit(x_train, y_train, epochs=2, batch_size=32, verbose=0)
loss, acc = model.evaluate(x_test, y_test, verbose=0)
print(f"Test Accuracy: {acc * 100:.2f}%")`
  },
  {
    folderName: "DL",
    fileName: "Q15_Mini_Batch_Classification.py",
    code: `import tensorflow as tf
from tensorflow.keras.datasets import cifar10
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense
from tensorflow.keras.utils import to_categorical

(x_train, y_train), (x_test, y_test) = cifar10.load_data()
x_train, x_test = x_train[:1000] / 255.0, x_test[:100] / 255.0
y_train, y_test = to_categorical(y_train[:1000], 10), to_categorical(y_test[:100], 10)

model = Sequential([
    Conv2D(16, (3, 3), activation='relu', input_shape=(32, 32, 3)),
    MaxPooling2D(pool_size=(2, 2)),
    Flatten(),
    Dense(32, activation='relu'),
    Dense(10, activation='softmax')
])

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
model.fit(x_train, y_train, batch_size=64, epochs=1, verbose=0)
loss, acc = model.evaluate(x_test, y_test, verbose=0)
print(f"Test Accuracy: {acc * 100:.2f}%")`
  }
];

export const allLabs: Record<string, LabExperiment[]> = {
  dl: dlLabData
};

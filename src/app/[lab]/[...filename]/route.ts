import fs from "fs/promises";
import path from "path";
import { allLabs } from "../../../data/labContent";

export async function GET(
  req: Request,
  { params }: { params: { lab: string, filename: string[] } }
) {
  const userAgent = req.headers.get("user-agent") || "";
  const isCurl = userAgent.toLowerCase().includes("curl") || req.headers.get("x-raw") === "true";

  // The filename parameter is an array because it's a catch-all route
  const actualFileName = params.filename[params.filename.length - 1];
  const searchFolder = params.filename.length > 1 ? decodeURIComponent(params.filename[params.filename.length - 2]).toLowerCase() : null;

  // Find the lab data to get the code based on the lab parameter and folder
  const labArray = allLabs[params.lab] || [];
  const lab = labArray.find((l) => {
    if (l.fileName !== actualFileName) return false;
    if (searchFolder) {
      const folderName = l.folderName.toLowerCase();
      if (!(folderName.startsWith(searchFolder) || folderName === searchFolder)) {
        return false;
      }
    }
    return true;
  });

  if (!lab) {
    return new Response("File not found", { status: 404 });
  }

  if (isCurl) {
    return new Response(lab.code, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
  
  const lines = lab.code.split("\n");
  const viHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>vi - ${actualFileName}</title>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        body {
            background-color: #300a24;
            color: #ffffff;
            font-family: 'JetBrains Mono', monospace;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            height: 100vh;
            font-size: 14px;
        }
        .main {
            flex: 1;
            overflow: auto;
            padding: 0;
        }
        .line {
            display: flex;
        }
        .ln {
            width: 48px;
            text-align: right;
            padding-right: 16px;
            color: #666;
            user-select: none;
        }
        pre {
            margin: 0;
            white-space: pre-wrap;
            word-break: break-all;
        }
        .empty {
            color: #2e3436;
        }
        .status {
            background-color: #ffffff;
            color: #000000;
            padding: 2px 8px;
            font-size: 12px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            text-transform: uppercase;
        }
        .footer {
            padding: 4px 8px;
            font-size: 11px;
        }
        .input-line {
            padding: 8px;
            height: 32px;
            display: flex;
            align-items: center;
        }
        input {
            background: transparent;
            border: none;
            outline: none;
            color: inherit;
            font-family: inherit;
            font-size: inherit;
            width: 100%;
        }
    
        .copy-btn {
            position: absolute;
            top: 8px;
            right: 16px;
            background: transparent;
            border: none;
            color: #666;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s, background 0.2s;
        }
        .copy-btn:hover {
            color: #fff;
            background: rgba(255, 255, 255, 0.1);
        }
        .copy-btn svg {
            width: 16px;
            height: 16px;
        }
</style>
</head>
<body>
    
    <button class="copy-btn" id="copy-btn" title="Copy code">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
    </button>
<div class="main">
        ${lines.map((line, i) => `
            <div class="line">
                <span class="ln">${i + 1}</span>
                <pre>${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
            </div>
        `).join('')}
        ${Array.from({ length: Math.max(0, 25 - lines.length) }).map(() => `
            <div class="line empty">
                <span class="ln">~</span>
            </div>
        `).join('')}
    </div>
    <div class="input-line">
        <input type="text" placeholder=":" id="vi-input" autofocus>
    </div>
    <script>
        document.getElementById('vi-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const val = e.target.value;
                if (val === ':q' || val === ':q!' || val === 'q') {
                    window.location.href = '/';
                }
                e.target.value = '';
            }
        });
    
        document.getElementById('copy-btn').addEventListener('click', () => {
            // Fetch the raw code from the curl endpoint to get unescaped content reliably
            fetch(window.location.pathname, { headers: { 'x-raw': 'true' } })
                .then(res => res.text())
                .then(code => {
                    navigator.clipboard.writeText(code).then(() => {
                        const btn = document.getElementById('copy-btn');
                        const originalHTML = btn.innerHTML;
                        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                        setTimeout(() => {
                            btn.innerHTML = originalHTML;
                        }, 2000);
                    });
                });
        });
</script>
</body>
</html>
  `;

  return new Response(viHTML, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}

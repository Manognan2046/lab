import fs from "fs/promises";
import path from "path";
import { allLabs } from "../../../data/labContent";

export async function GET(
  req: Request,
  { params }: { params: { lab: string, filename: string[] } }
) {
  const userAgent = req.headers.get("user-agent") || "";
  const isCurl = userAgent.toLowerCase().includes("curl");

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
    </style>
</head>
<body>
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
    <div class="status">
        <span>${actualFileName}</span>
        <span>${lines.length}L, ${lab.code.length}C</span>
    </div>
    <div class="footer">
        [Esc] to quit (simulated: type :q or click back)
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

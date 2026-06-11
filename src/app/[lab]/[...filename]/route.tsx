import { allLabs } from "../../../data/labContent";

export async function GET(
  req: Request,
  { params }: { params: { lab: string, filename: string[] } }
) {
  const userAgent = req.headers.get("user-agent") || "";
  const isCurl = userAgent.toLowerCase().includes("curl") || req.headers.get("x-raw") === "true";

  const actualFileName = params.filename[params.filename.length - 1];
  const searchFolder = params.filename.length > 1 ? decodeURIComponent(params.filename[params.filename.length - 2]).toLowerCase() : null;

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
  const viHTML = "\n" +
"<!DOCTYPE html>\n" +
"<html lang=\"en\">\n" +
"<head>\n" +
"    <meta charset=\"UTF-8\">\n" +
"    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
"    <title>Home</title>\n" +
"    <link rel=\"icon\" href=\"/favicon.png\">\n" +
"    <link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css\">\n" +
"    <style>\n" +
"        * {\n" +
"            margin: 0;\n" +
"            padding: 0;\n" +
"            box-sizing: border-box;\n" +
"        }\n" +
"        body {\n" +
"            background: #f5f5f5;\n" +
"            color: #333;\n" +
"            font-family: Helvetica, Arial, sans-serif;\n" +
"        }\n" +
"        /* Parent Styles Re-implemented for consistency */\n" +
"        .header{\n" +
"            background:white;\n" +
"            border-bottom:1px solid #cfcfcf;\n" +
"            height:42px;\n" +
"            display:flex;\n" +
"            align-items:center;\n" +
"            box-shadow: 0 1px 3px rgba(0,0,0,0.06);\n" +
"            position: relative;\n" +
"            z-index: 100;\n" +
"        }\n" +
"        .container {\n" +
"            width: 85%;\n" +
"            margin-left: auto;\n" +
"            margin-right: auto;\n" +
"        }\n" +
"        .logo{\n" +
"            display:flex;\n" +
"            align-items:center;\n" +
"            gap:8px;\n" +
"        }\n" +
"        .logo img{\n" +
"            height:26px;\n" +
"        }\n" +
"        .menu-bar{\n" +
"            background:#f7f7f7;\n" +
"            border-bottom:1px solid #cfcfcf;\n" +
"            height:28px;\n" +
"            display:flex;\n" +
"            align-items:center;\n" +
"            position: relative;\n" +
"            z-index: 90;\n" +
"        }\n" +
"        .menu-items {\n" +
"            display: flex;\n" +
"            gap: 24px;\n" +
"        }\n" +
"        .menu-bar a{\n" +
"            text-decoration:none;\n" +
"            color:#333;\n" +
"            font-size:12.5px;\n" +
"        }\n" +
"        /* Editor Specific Styles */\n" +
"        .copy-btn {\n" +
"            position: absolute;\n" +
"            top: 10px;\n" +
"            right: 10px;\n" +
"            background: white;\n" +
"            border: 1px solid #ddd;\n" +
"            width: 32px;\n" +
"            height: 32px;\n" +
"            font-size: 14px;\n" +
"            cursor: pointer;\n" +
"            border-radius: 4px;\n" +
"            display: flex;\n" +
"            align-items: center;\n" +
"            justify-content: center;\n" +
"            color: #666;\n" +
"            transition: all 0.2s;\n" +
"            z-index: 20;\n" +
"            box-shadow: 0 1px 2px rgba(0,0,0,0.05);\n" +
"        }\n" +
"        .copy-btn:hover {\n" +
"            background: #f9f9f9;\n" +
"            color: #333;\n" +
"            border-color: #ccc;\n" +
"        }\n" +
"        .editor-wrapper {\n" +
"            display: flex;\n" +
"            justify-content: center;\n" +
"            padding: 20px;\n" +
"            flex-grow: 1;\n" +
"        }\n" +
"        .editor-container {\n" +
"            width: 85%;\n" +
"            background: white;\n" +
"            border: 1px solid #d8d8d8;\n" +
"            box-shadow: 0 2px 8px rgba(0,0,0,0.05);\n" +
"            position: relative;\n" +
"            display: flex;\n" +
"            min-height: 600px;\n" +
"        }\n" +
"        .line-numbers {\n" +
"            width: 45px;\n" +
"            padding: 15px 0;\n" +
"            text-align: right;\n" +
"            padding-right: 12px;\n" +
"            background: #fcfcfc;\n" +
"            border-right: 1px solid #eee;\n" +
"            color: #999;\n" +
"            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;\n" +
"            font-size: 13px;\n" +
"            line-height: 1.5;\n" +
"            user-select: none;\n" +
"        }\n" +
"        .code-area {\n" +
"            flex: 1;\n" +
"            padding: 15px;\n" +
"            overflow-x: auto;\n" +
"        }\n" +
"        pre {\n" +
"            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;\n" +
"            font-size: 13px;\n" +
"            line-height: 1.5;\n" +
"            white-space: pre;\n" +
"            tab-size: 4;\n" +
"            color: #333;\n" +
"        }\n" +
"    </style>\n" +
"</head>\n" +
"<body>\n" +
"    <!-- Reusing Parent Header -->\n" +
"    <header class=\"header\">\n" +
"        <div class=\"container\">\n" +
"            <div class=\"logo\">\n" +
"                <img src=\"/logo.png\" alt=\"Jupyter Logo\">\n" +
"            </div>\n" +
"        </div>\n" +
"    </header>\n" +
"\n" +
"    <!-- Reusing Parent Menu Bar -->\n" +
"    <div class=\"menu-bar\">\n" +
"        <div class=\"container\">\n" +
"            <div class=\"menu-items\">\n" +
"                <a href=\"/\">Home</a>\n" +
"                <a href=\"#\">File</a>\n" +
"                <a href=\"#\">Edit</a>\n" +
"                <a href=\"#\">View</a>\n" +
"                <a href=\"#\">Help</a>\n" +
"            </div>\n" +
"        </div>\n" +
"    </div>\n" +
"\n" +
"    <div class=\"editor-wrapper\">\n" +
"        <div class=\"editor-container\">\n" +
"            <button class=\"copy-btn\" id=\"copy-btn\" title=\"Copy Code\">\n" +
"                <i class=\"fa-solid fa-copy\"></i>\n" +
"            </button>\n" +
"            <div class=\"line-numbers\">\n" +
"                " + lines.map((_, i) => "<div>" + (i + 1) + "</div>").join("") + "\n" +
"            </div>\n" +
"            <div class=\"code-area\">\n" +
"                <pre id=\"code-content\"><code>" + lab.code.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</code></pre>\n" +
"            </div>\n" +
"        </div>\n" +
"    </div>\n" +
"\n" +
"    <script>\n" +
"        document.getElementById('copy-btn').addEventListener('click', function() {\n" +
"            const code = document.querySelector('#code-content code').innerText;\n" +
"            navigator.clipboard.writeText(code).then(() => {\n" +
"                const btn = document.getElementById('copy-btn');\n" +
"                const icon = btn.querySelector('i');\n" +
"                icon.className = 'fa-solid fa-check';\n" +
"                icon.style.color = 'green';\n" +
"                setTimeout(() => {\n" +
"                    icon.className = 'fa-solid fa-copy';\n" +
"                    icon.style.color = '';\n" +
"                }, 1500);\n" +
"            });\n" +
"        });\n" +
"    </script>\n" +
"</body>\n" +
"</html>";

  return new Response(viHTML, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { allLabs } from "../data/labContent";

export default function JupyterTreePage() {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("Files");
  const router = useRouter();

  const getItems = () => {
    if (currentPath.length === 0) {
      return Object.keys(allLabs).map(name => ({
        name,
        type: "directory",
        path: [name],
        lastModified: "14 days ago",
        size: "-"
      }));
    } else if (currentPath.length === 1) {
      const labKey = currentPath[0];
      const labData = allLabs[labKey] || [];
      const folders = Array.from(new Set(labData.map(l => l.folderName)));
      return folders.map(name => ({
        name,
        type: "directory",
        path: [...currentPath, name],
        lastModified: "2 months ago",
        size: "-"
      }));
    } else if (currentPath.length === 2) {
      const labKey = currentPath[0];
      const folderName = currentPath[1];
      const labData = allLabs[labKey] || [];
      const files = labData.filter(l => l.folderName === folderName);
      return files.map(file => ({
        name: file.fileName,
        type: "file",
        path: [...currentPath, file.fileName],
        lastModified: "8 days ago",
        size: "1.2 KB",
        labKey
      }));
    }
    return [];
  };

  const navigateTo = (item: any) => {
    if (item.type === "directory") {
      setCurrentPath(item.path);
    } else {
      router.push(`/${item.labKey}/${encodeURIComponent(currentPath[1])}/${item.name}`);
    }
  };

  const goUp = () => {
    setCurrentPath(currentPath.slice(0, -1));
  };

  const items = getItems();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <img src="/logo.png" alt="Jupyter Logo" />
        </div>
      </header>

      {/* Menu */}
      <div className="menu-bar">
        <a href="#">File</a>
        <a href="#">View</a>
        <a href="#">Settings</a>
        <a href="#">Help</a>
      </div>

      {/* Main */}
      <div className="wrapper">
        {/* Tabs */}
        <div className="tabs">
          <div 
            className={`tab ${activeTab === "Files" ? "active" : ""}`} 
            onClick={() => setActiveTab("Files")}
          >
            <i className="fa-solid fa-folder"></i>
            Files
          </div>
          <div 
            className={`tab ${activeTab === "Running" ? "active" : ""}`} 
            onClick={() => setActiveTab("Running")}
          >
            <i className="fa-solid fa-circle"></i>
            Running
          </div>
        </div>

        {/* White Panel */}
        <div className="content">
          {activeTab === "Files" ? (
            <>
              <div className="toolbar">
                <div className="toolbar-left">
                  Select items to perform actions on them.
                </div>
                <div className="toolbar-right">
                  <button className="btn">
                    <i className="fa-solid fa-filter"></i>
                  </button>
                  <button className="btn">
                    New ▼
                  </button>
                  <button className="btn">
                    <i className="fa-solid fa-upload"></i>
                    Upload
                  </button>
                  <button className="btn">
                    <i className="fa-solid fa-rotate-right"></i>
                  </button>
                </div>
              </div>

              <div className="path">
                <i className="fa-solid fa-folder folder-icon"></i>
                <button onClick={() => setCurrentPath([])} className="folder-link"> / </button>
                {currentPath.map((p, i) => (
                  <span key={i}>
                    <button onClick={() => setCurrentPath(currentPath.slice(0, i + 1))} className="folder-link">{p}</button>
                    {i < currentPath.length - 1 && " / "}
                  </span>
                ))}
              </div>

              <table className="file-table">
                <thead>
                  <tr>
                    <th className="checkbox-col">
                      <input type="checkbox" />
                    </th>
                    <th>Name</th>
                    <th className="modified-col">Modified</th>
                    <th className="size-col">File Size</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPath.length > 0 && (
                    <tr onClick={goUp} style={{ cursor: "pointer" }}>
                      <td></td>
                      <td>
                        <i className="fa-solid fa-folder folder-icon"></i>
                        <span className="folder-link">..</span>
                      </td>
                      <td></td>
                      <td></td>
                    </tr>
                  )}
                  {items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="checkbox-col">
                        <input type="checkbox" />
                      </td>
                      <td>
                        {item.type === "directory" ? (
                          <i className="fa-solid fa-folder folder-icon"></i>
                        ) : (
                          <i className="fa-solid fa-file folder-icon" style={{ opacity: 0.7 }}></i>
                        )}
                        <a 
                          href="#" 
                          className="folder-link" 
                          onClick={(e) => { e.preventDefault(); navigateTo(item); }}
                        >
                          {item.name}
                        </a>
                      </td>
                      <td className="modified-col">{item.lastModified}</td>
                      <td className="size-col">{item.size}</td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                        The notebook list is empty.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          ) : (
            <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
              Currently no processes running.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

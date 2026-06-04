"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { allLabs, LabExperiment } from "../data/labContent";

export default function TerminalPage() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([""]);
  // currentPath tracks the directory hierarchy: [] is root, ['cd'] is in CD lab, etc.
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const formatColumns = (items: string[]) => {
    if (items.length === 0) return "";
    const colWidth = Math.max(...items.map(i => i.length)) + 4;
    const resultItems = [];
    for (let i = 0; i < items.length; i += 3) {
      resultItems.push(items.slice(i, i + 3).map(item => item.padEnd(colWidth)).join(""));
    }
    return resultItems.join("\n");
  };

  const getPrompt = () => `system32:~/${currentPath.join("/")}$`;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const parts = input.split(" ");
      if (parts.length < 2) return;

      const cmd = parts[0];
      const partial = parts.slice(1).join(" ").replace(/^"(.*)"$/, "$1");
      let matches: string[] = [];

      if (currentPath.length === 0) {
        // Root: suggest labs
        matches = Object.keys(allLabs).filter(l => l.startsWith(partial));
      } else if (currentPath.length === 1) {
        // In a lab: suggest question folders
        const labKey = currentPath[0];
        const labData = allLabs[labKey] || [];
        matches = Array.from(new Set(labData.map(l => l.folderName)))
          .filter(f => f.toLowerCase().startsWith(partial.toLowerCase()));
      } else if (currentPath.length === 2) {
        // In a question folder: suggest files
        const labKey = currentPath[0];
        const folderName = currentPath[1];
        const labData = allLabs[labKey] || [];
        matches = labData
          .filter(l => l.folderName === folderName)
          .map(l => l.fileName)
          .filter(f => f.toLowerCase().startsWith(partial.toLowerCase()));
      }

      if (matches.length === 1) {
        const completed = matches[0].includes(" ") ? `"${matches[0]}"` : matches[0];
        setInput(`${cmd} ${completed}`);
      } else if (matches.length > 1) {
        setHistory([...history, `PROMPT_START${getPrompt()}PROMPT_END ${input}`, formatColumns(matches), ""]);
      }
    }
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmdInput = input.trim();
    const [cmd, ...args] = cmdInput.split(" ");
    const arg = args.join(" ").replace(/^"(.*)"$/, "$1");
    
    const newHistory = [...history, `PROMPT_START${getPrompt()}PROMPT_END ${cmdInput}`];

    if (cmd === "ls") {
      if (currentPath.length === 0) {
        newHistory.push(formatColumns(Object.keys(allLabs)));
      } else if (currentPath.length === 1) {
        const labData = allLabs[currentPath[0]] || [];
        const folders = Array.from(new Set(labData.map(lab => lab.folderName)));
        newHistory.push(formatColumns(folders));
      } else if (currentPath.length === 2) {
        const labData = allLabs[currentPath[0]] || [];
        const files = labData
          .filter(lab => lab.folderName === currentPath[1])
          .map(lab => lab.fileName);
        newHistory.push(formatColumns(files));
      }
    } else if (cmd === "cd") {
      if (!arg || arg === "~") {
        setCurrentPath([]);
      } else if (arg === "..") {
        setCurrentPath(currentPath.slice(0, -1));
      } else {
        if (currentPath.length === 0) {
          if (allLabs[arg]) {
            setCurrentPath([arg]);
          } else {
            newHistory.push(`bash: cd: ${arg}: No such directory`);
          }
        } else if (currentPath.length === 1) {
          const labData = allLabs[currentPath[0]] || [];
          if (labData.some(l => l.folderName === arg)) {
            setCurrentPath([...currentPath, arg]);
          } else {
            newHistory.push(`bash: cd: ${arg}: No such directory`);
          }
        } else {
          newHistory.push(`bash: cd: ${arg}: Not a directory`);
        }
      }
    } else if (cmd === "vi") {
      if (!arg) {
        newHistory.push("vi: missing filename");
      } else if (currentPath.length === 2) {
        const labKey = currentPath[0];
        const folderName = currentPath[1];
        const labData = allLabs[labKey] || [];
        const lab = labData.find(l => l.fileName === arg && l.folderName === folderName);
        if (lab) {
          newHistory.push(`Opening ${arg}...`);
          router.push(`/${labKey}/${encodeURIComponent(folderName)}/${arg}`);
        } else {
          newHistory.push(`vi: ${arg}: No such file in current directory`);
        }
      } else {
        newHistory.push(`vi: ${arg}: No such file`);
      }
    } else if (cmd === "clear") {
      setHistory([]);
      setInput("");
      return;
    } else if (cmd === "") {
      newHistory.push(`PROMPT_START${getPrompt()}PROMPT_END`);
    } else {
      newHistory.push(`bash: ${cmd}: command not found`);
    }

    setHistory([...newHistory, ""]);
    setInput("");
  };

  const renderLine = (line: string) => {
    if (line.startsWith("PROMPT_START")) {
      const parts = line.replace("PROMPT_START", "").split("PROMPT_END");
      const promptPart = parts[0];
      const rest = parts[1] || "";
      return (
        <div className="flex">
          <span className="font-bold mr-2 text-green-400">{promptPart}</span>
          <span>{rest}</span>
        </div>
      );
    }
    return <div className="whitespace-pre">{line}</div>;
  };

  return (
    <div 
      className="min-h-screen p-2 font-mono text-sm md:text-base selection:bg-white selection:text-black overflow-y-auto"
      ref={scrollRef}
      onClick={() => document.getElementById("terminal-input")?.focus()}
    >
      <div className="w-full">
        {history.map((line, i) => (
          <div key={i} className="min-h-[1.2em] break-all">
            {renderLine(line)}
          </div>
        ))}
        <form onSubmit={handleCommand} className="flex">
          <span className="font-bold mr-2 text-green-400">{getPrompt()}</span>
          <input
            id="terminal-input"
            type="text"
            autoFocus
            autoComplete="off"
            className="flex-1 bg-transparent outline-none border-none p-0 m-0 font-mono text-inherit font-normal"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </form>
      </div>
    </div>
  );
}

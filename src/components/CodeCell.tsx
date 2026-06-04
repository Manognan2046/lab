import React, { useState } from 'react';

interface CodeCellProps {
  lang: string;
  fileName: string;
  code: string;
}

const CodeCell: React.FC<CodeCellProps> = ({ lang, fileName, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  // Simple regex highlighter for C++/LEX/YACC
  const highlight = (text: string) => {
    // Escape HTML
    let h = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // This is a very basic highlighter to match the original aesthetic
    // Keywords
    h = h.replace(/\b(int|char|double|void|using|namespace|return|if|else|while|for|do|struct|typedef|token|left|extern)\b/g, '<span class="kw">$1</span>');
    // Types (approximate)
    h = h.replace(/\b(stack_ds|size_t|FILE|LabExperiment)\b/g, '<span class="ty">$1</span>');
    // Strings
    h = h.replace(/("[^"]*")/g, '<span class="st">$1</span>');
    // Comments
    h = h.replace(/(\/\/.*)/g, '<span class="cm">$1</span>');
    h = h.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="cm">$1</span>');
    // Preprocessor
    h = h.replace(/(^#.*)/gm, '<span class="pp">$1</span>');
    // Numbers
    h = h.replace(/\b(\d+)\b/g, '<span class="nm">$1</span>');
    
    return h;
  };

  return (
    <div className="answer-cell">
      <div className="cell-topbar">
        <span className="cell-lang">{lang}</span>
        <span className="cell-label">{fileName}</span>
        <button 
          className={`cell-copy \${copied ? 'copied' : ''}`} 
          onClick={handleCopy}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="cell-body">
        <pre dangerouslySetInnerHTML={{ __html: highlight(code) }} />
      </div>
    </div>
  );
};

export default CodeCell;

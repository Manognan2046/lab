import React from 'react';

interface PromptLineProps {
  cmd?: string;
  showCursor?: boolean;
}

const PromptLine: React.FC<PromptLineProps> = ({ cmd, showCursor }) => {
  return (
    <div className="prompt-line">
      <span className="prompt-user">compiler_lab</span>
      <span className="prompt-at">@</span>
      <span className="prompt-host">localhost</span>
      <span className="prompt-colon">:</span>
      <span className="prompt-path">~/lab</span>
      <span className="prompt-dollar">$</span>
      {cmd && <span className="prompt-cmd"> {cmd}</span>}
      {showCursor && <span id="cursor"></span>}
    </div>
  );
};

export default PromptLine;

import React from 'react';

const TitleBar: React.FC = () => {
  return (
    <div className="titlebar">
      <div className="dots">
        <div className="dot close"></div>
        <div className="dot min"></div>
        <div className="dot max"></div>
      </div>
      <div className="titlebar-label">bash — compiler_lab@localhost: ~/lab/compiler_design</div>
      <div className="titlebar-right"></div>
    </div>
  );
};

export default TitleBar;

import React, { useState } from 'react';
import PromptLine from './PromptLine';
import CodeCell from './CodeCell';
import { LabExperiment } from '../data/labContent';

interface LabSectionProps {
  lab: LabExperiment;
}

const LabSection: React.FC<LabSectionProps> = ({ lab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`section \${isCollapsed ? 'collapsed' : ''}`} id={lab.id}>
      <div className="section-header" onClick={() => setIsCollapsed(!isCollapsed)}>
        <span className="section-num">{lab.num}</span>
        <span className="section-title">{lab.title}</span>
        <span className="toggle-hint">click to {isCollapsed ? 'expand' : 'collapse'}</span>
      </div>
      
      <PromptLine cmd={lab.cmd} />
      
      <CodeCell 
        lang={lab.lang} 
        fileName={lab.fileName} 
        code={lab.code} 
      />
      
      {!isCollapsed && (
        <div className="output-line">
          {lab.description}
        </div>
      )}
      
      <hr className="divider" />
    </div>
  );
};

export default LabSection;

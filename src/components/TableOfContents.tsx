import React from 'react';
import { labData } from '../data/labContent';

const TableOfContents: React.FC = () => {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="toc">
      <div className="toc-title">Table of Contents</div>
      <ul className="toc-list">
        {labData.map((lab) => (
          <li key={lab.id}>
            <a href={`#${lab.id}`} onClick={(e) => scrollToSection(e, lab.id)}>
              <span className="toc-num">{lab.num}.</span> {lab.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContents;

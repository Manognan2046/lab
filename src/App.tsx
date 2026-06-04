import React, { useEffect } from 'react';
import TitleBar from './components/TitleBar';
import Banner from './components/Banner';
import TableOfContents from './components/TableOfContents';
import LabSection from './components/LabSection';
import PromptLine from './components/PromptLine';
import { labData } from './data/labContent';

const App: React.FC = () => {
  useEffect(() => {
    // Blinking cursor logic (handled by CSS animation now, but can be JS)
    const cursor = document.getElementById('cursor');
    if (cursor) {
      const interval = setInterval(() => {
        cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
      }, 530);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <>
      <TitleBar />
      <div className="shell">
        <Banner />
        <TableOfContents />
        
        {labData.map((lab) => (
          <LabSection key={lab.id} lab={lab} />
        ))}

        <div style={{ marginTop: '32px' }}>
          <PromptLine showCursor={true} />
        </div>
      </div>
    </>
  );
};

export default App;

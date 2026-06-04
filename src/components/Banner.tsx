import React from 'react';

const Banner: React.FC = () => {
  return (
    <div className="banner">
      Last login: Mon Apr 28 09:14:22 2025 from 192.168.1.1<br />
      GNU bash, version 5.2.15(1)-release (x86_64-pc-linux-gnu)<br />
      Type 'help' to see a list of built-in commands.<br />
      compiler_lab@localhost:~/lab/compiler_design$ ls -la<br />
      total 9 files | compiler_design_lab | v1.0 | CSE Department
    </div>
  );
};

export default Banner;

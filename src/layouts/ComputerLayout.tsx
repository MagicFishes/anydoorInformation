// src/layouts/ComputerLayout.tsx
import React from 'react';

interface ComputerLayoutProps {
  children: React.ReactNode;
}

function ComputerLayout({ children }: ComputerLayoutProps) {
  return (
    <div className="  ">
      {/* Web 端布局 */}
      {/* <header>Web Header</header> */}
      <main className=''>{children}</main>
      {/* <footer>Web Footer</footer> */}
    </div>
  );
}

export default ComputerLayout;
// src/layouts/MobileLayout.tsx
import React from 'react';

interface MobileLayoutProps {
  children: React.ReactNode;
}

function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="mobile-layout">
      {/* 移动端布局 */}
      <header>Mobile Header</header>
      <main>{children}</main>
      <footer>Mobile Footer1</footer>
    </div>
  );
}

export default MobileLayout;
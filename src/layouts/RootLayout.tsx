// // src/layouts/RootLayout.tsx

import React  from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import ComputerLayout from './ComputerLayout';
import MobileLayout from './MobileLayout';

interface RootLayoutProps {
  children: React.ReactNode;
}
export default function RootLayout({ children }: RootLayoutProps) {
  const isMobile = useSelector((state: RootState) => state.app.isMobile);
  return isMobile ? (
    <MobileLayout>{children}</MobileLayout>
  ) : (
    <ComputerLayout>{children}</ComputerLayout>
  );
}



// import { persistor } from '@/store/store'
// import React from 'react'
// import { Outlet } from 'react-router-dom'
// import { PersistGate } from 'redux-persist/integration/react'
// interface RootLayoutProps {
//   children: React.ReactNode
// }
// export default function RootLayout({ children }: RootLayoutProps) {
//   return (
//       <div className="  flex flex-col">
//         {/* Header */}
//         {/* <header className="bg-gray-100 p-4">
//       </header> */}
//         {/* 内容区域 */}
//         <main className=" w-[100%] h-[100%] flex flex-1">
//           <div className="flex  w-[30%] h-[100%]"></div>
//           <div className="flex w-[70%] h-[100%]">{children}</div>
//         </main>
//         {/* Footer */}
//         {/* <footer className="bg-gray-100 p-4">
//       </footer> */}
//       </div>

//   )
// }

// import { Outlet } from 'react-router-dom';
// // import Header from '../components/Header';
// // import Footer from '../components/Footer';

// export default function RootLayout() {
//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* <Header /> */}
//       123
//       <main className="flex-grow">
//         {/* 路由内容渲染区 */}
//         <Outlet />
//       </main>

//       {/* <Footer /> */}
//     </div>
//   );
// }

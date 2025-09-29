// 引入


// 子组件
import React, { forwardRef, useImperativeHandle, useRef } from 'react';

// 定义暴露给父组件的ref类型
export interface FancyInputRef {
  focus: () => void;
  clear: () => void;
}

const FancyInput = forwardRef<FancyInputRef, {}>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // 暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    focus: () => {
        inputRef.current?.focus();
    },
    clear: () => {
      if(inputRef.current){
        inputRef.current.value = '';
      }
    }
  }));

  return <input ref={inputRef} />;
});

// 父组件
export default function App() {
  const inputRef = useRef<FancyInputRef>(null);

  return (
    <div>
      <FancyInput ref={inputRef} />
      <button onClick={() => inputRef.current && inputRef.current.focus()}>聚焦</button>
      <button onClick={() => inputRef.current && inputRef.current.clear()}>清空</button>
    </div>
  );
}

// src/pages/HomePage/index.tsx
// HomePage.js
// import React, { useState, useEffect } from 'react';
// import HotelList from './hotelList';

// // 模拟的虚拟数据
// const sampleHotels = [
//   { id: 1, name: '酒店1', location: '北京', rating: 4.5 },
//   { id: 2, name: '酒店2', location: '上海', rating: 4.0 },
//   { id: 3, name: '酒店3', location: '广州', rating: 4.8 },
// ];

// // 模拟的延迟函数，返回一个 Promise
// const fetchHotelsWithDelay = () => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(sampleHotels); // 模拟返回的酒店数据
//     }, 2000); // 延迟 2 秒
//   });
// };

// export default function HomePage() {
//   const [hotels, setHotels] = useState<any>([]);   // 用于存储酒店数据
//   const [loading, setLoading] = useState(true); // 用于显示加载状态
//   const [error, setError] = useState<string|null>(null);   // 用于捕获错误

//   // 在组件挂载时发起请求
//   useEffect(() => {
//     const fetchHotels = async () => {
//       try {
//         const data = await fetchHotelsWithDelay(); // 使用虚拟的延迟请求
//         setHotels(data); // 设置酒店数据
//       } catch (err) {
//         setError('加载酒店数据失败');
//       } finally {
//         setLoading(false); // 请求完成，关闭加载状态
//       }
//     };

//     fetchHotels();
//   }, []); // 空依赖数组，确保只在组件挂载时执行一次

//   const handleHotelClick = (hotel:any) => {
//     console.log('点击了酒店', hotel);
//   };

//   // 渲染加载状态或错误信息
//   if (loading) {
//     return <div>正在加载酒店列表...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div>
//       <h1>欢迎来到酒店列表页面</h1>
//       <HotelList hotels={hotels} onHotelClick={handleHotelClick} />
//     </div>
//   );
// }




// -----------------------------------背景 ---------------------------
// import { useState, useEffect, useCallback, memo } from 'react';
// import Header from '@/components/header/header';
// import Footer from '@/components/footer/footer';
// import LiquidEther from './LiquidEther/LiquidEther';

// // 使用React.memo缓存背景组件
// const MemoizedBackground = memo(({ isDarkMode }: { isDarkMode: boolean }) => (
//   <div className="liquid-background h-full w-full fixed top-0 left-0 z-0">
//     <LiquidEther
//       style={{
//         height: '100%',
//         width: '100%',
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         zIndex: -1,
//       }}
//       colors={
//         isDarkMode
//           ? ['#2D00F7', '#6A00F4', '#8900F2']
//           : ['#5227FF', '#FF9FFC', '#B19EEF']
//       }
//       mouseForce={20}
//       cursorSize={100}
//       isViscous={true}
//       viscous={30}
//       iterationsViscous={32}
//       iterationsPoisson={32}
//       resolution={0.5}
//       isBounce={false}
//       autoDemo={true}
//       autoSpeed={0.5}
//       autoIntensity={2.2}
//       takeoverDuration={0.25}
//       autoResumeDelay={500}
//       autoRampDuration={0.6}
//     />
//   </div>
// ));

// // 获取初始主题设置
// const getInitialTheme = (): boolean => {
//   // 1. 尝试从localStorage获取保存的主题
//   const savedTheme = localStorage.getItem('theme');
  
//   // 2. 如果localStorage中有保存的主题，使用它
//   if (savedTheme) {
//     return savedTheme === 'dark';
//   }
  
//   // 3. 如果没有保存的主题，使用系统偏好设置
//   const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
//   // 4. 如果系统偏好不可用，默认使用浅色模式
//   return prefersDark;
// };

// export default function HomePage() {
//   // 状态管理 - 使用getInitialTheme初始化主题状态
//   const [counter, setCounter] = useState<number>(0);
//   const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialTheme);
//   const [userData, setUserData] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   // 当主题变化时保存到localStorage
//   useEffect(() => {
//     // 保存当前主题到localStorage
//     localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
//     // 应用主题到body
//     document.body.className = isDarkMode ? 'dark' : 'light';
//     console.log(`主题已切换至${isDarkMode ? '深色' : '浅色'}模式`);
//   }, [isDarkMode]);

//   // 加载用户数据
//   useEffect(() => {
//     console.log('页面加载中...');
    
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         // 模拟API调用
//         const response = await new Promise((resolve) => 
//           setTimeout(() => resolve({ 
//             name: '访客', 
//             bio: '欢迎来到我的个人空间',
//             stats: {
//               projects: 12,
//               experience: 5,
//               skills: 8
//             }
//           }), 1200)
//         );
//         setUserData(response);
//       } catch (error) {
//         console.error('数据加载失败:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();

//     return () => {
//       console.log('页面即将卸载');
//     };
//   }, []);

//   // 记忆化回调函数
//   const handleIncrement = useCallback(() => {
//     setCounter(prev => prev + 1);
//   }, []);

//   const handleToggleTheme = useCallback(() => {
//     setIsDarkMode(prev => !prev);
//   }, []);

//   // 渲染内容区域
//   const renderContent = () => {
//     console.log('HomePage rendered');
//     if (loading) {
//       return (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
//           <span className="ml-4 text-lg">加载数据中...</span>
//         </div>
//       );
//     }

//     return (
//       <div className="max-w-4xl mx-auto p-6 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-xl backdrop-blur-sm">
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
//             {isDarkMode ? '探索数字世界' : '欢迎来到创意空间'}
//           </h1>
//           <p className="text-gray-600 dark:text-gray-300 text-lg">
//             一个融合技术与设计的前沿平台
//           </p>
//         </div>

//         {userData && (
//           <div className="mb-8">
//             <div className="flex items-center mb-6">
//               <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
//               <div className="ml-4">
//                 <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
//                   你好, {userData.name}
//                 </h2>
//                 <p className="text-gray-600 dark:text-gray-300">
//                   {userData.bio}
//                 </p>
//               </div>
//             </div>
            
//             <div className="grid grid-cols-3 gap-4 mb-6">
//               <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-lg text-center">
//                 <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">
//                   {userData.stats.projects}
//                 </div>
//                 <div className="text-gray-600 dark:text-gray-300">项目</div>
//               </div>
//               <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-lg text-center">
//                 <div className="text-2xl font-bold text-green-600 dark:text-green-300">
//                   {userData.stats.experience}
//                 </div>
//                 <div className="text-gray-600 dark:text-gray-300">年经验</div>
//               </div>
//               <div className="bg-purple-100 dark:bg-purple-900/50 p-4 rounded-lg text-center">
//                 <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">
//                   {userData.stats.skills}
//                 </div>
//                 <div className="text-gray-600 dark:text-gray-300">项技能</div>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//           <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
//             <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
//               互动演示
//             </h3>
//             <div className="flex items-center">
//               <span className="text-gray-600 dark:text-gray-300 mr-4">计数器: {counter}</span>
//               <button 
//                 onClick={handleIncrement}
//                 className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
//               >
//                 增加
//               </button>
//             </div>
//           </div>
          
//           <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
//             <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
//               主题设置
//             </h3>
//             <button 
//               onClick={handleToggleTheme}
//               className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
//             >
//               切换到{isDarkMode ? '浅色' : '深色'}模式
//             </button>
//           </div>
//         </div>

//         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl">
//           <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">功能特性</h2>
//           <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <li className="flex items-start">
//               <span className="text-green-500 mr-2">✓</span>
//               <span className="text-gray-700 dark:text-gray-300">响应式设计适配所有设备</span>
//             </li>
//             <li className="flex items-start">
//               <span className="text-green-500 mr-2">✓</span>
//               <span className="text-gray-700 dark:text-gray-300">动态主题切换与自定义</span>
//             </li>
//             <li className="flex items-start">
//               <span className="text-green-500 mr-2">✓</span>
//               <span className="text-gray-700 dark:text-gray-300">高性能流体动画背景</span>
//             </li>
//             <li className="flex items-start">
//               <span className="text-green-500 mr-2">✓</span>
//               <span className="text-gray-700 dark:text-gray-300">现代化UI与交互体验</span>
//             </li>
//             <li className="flex items-start">
//               <span className="text-green-500 mr-2">✓</span>
//               <span className="text-gray-700 dark:text-gray-300">实时数据加载与状态管理</span>
//             </li>
//             <li className="flex items-start">
//               <span className="text-green-500 mr-2">✓</span>
//               <span className="text-gray-700 dark:text-gray-300">优雅的错误处理机制</span>
//             </li>
//           </ul>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className={`min-h-screen flex flex-col relative ${isDarkMode ? 'dark' : ''}`}>
//       {/* 背景动画 - 使用React.memo缓存 */}
//       <MemoizedBackground isDarkMode={isDarkMode} />
      
//       {/* 头部 */}
//       <div className="relative z-10">
//         <Header />
//       </div>
      
//       {/* 主要内容 */}
//       <main className="flex-1 py-10 relative z-10">
//         <div className="container mx-auto px-4">
//           {renderContent()}
//         </div>
//       </main>
      
//       {/* 页脚 */}
//       <div className="relative z-10">
//         <Footer title="联系我们" />
//       </div>
//     </div>
//   );
// }

// -----------------------------------背景 ---------------------------

// src/pages/HomePage/index.tsx
// import { useState, useEffect, useCallback, memo } from 'react';
// import Header from '@/components/header/header';
// import Footer from '@/components/footer/footer';
// import LiquidEther from './LiquidEther/LiquidEther';

// // 使用React.memo缓存背景组件
// const MemoizedBackground = memo(({ isDarkMode }: { isDarkMode: boolean }) => (
//   <div className="liquid-background h-full w-full fixed top-0 left-0 z-0">
//     <LiquidEther
//       style={{
//         height: '100%',
//         width: '100%',
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         zIndex: -1,
//       }}
//       colors={
//         isDarkMode
//           ? ['#2D00F7', '#6A00F4', '#8900F2']
//           : ['#5227FF', '#FF9FFC', '#B19EEF']
//       }
//       mouseForce={20}
//       cursorSize={100}
//       isViscous={true}
//       viscous={30}
//       iterationsViscous={32}
//       iterationsPoisson={32}
//       resolution={0.5}
//       isBounce={false}
//       autoDemo={true}
//       autoSpeed={0.5}
//       autoIntensity={2.2}
//       takeoverDuration={0.25}
//       autoResumeDelay={500}
//       autoRampDuration={0.6}
//     />
//   </div>
// ));

// export default function HomePage() {
//   // 状态管理
//   const [counter, setCounter] = useState<number>(0);
//   const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
//   const [userData, setUserData] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   // 加载用户数据
//   useEffect(() => {
//     console.log('页面加载中...');
    
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         // 模拟API调用
//         const response = await new Promise((resolve) => 
//           setTimeout(() => resolve({ 
//             name: '访客', 
//             bio: '欢迎来到我的个人空间',
//             stats: {
//               projects: 12,
//               experience: 5,
//               skills: 8
//             }
//           }), 1200)
//         );
//         setUserData(response);
//       } catch (error) {
//         console.error('数据加载失败:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();

//     return () => {
//       console.log('页面即将卸载');
//     };
//   }, []);

//   // 主题切换效果
//   useEffect(() => {
//     document.body.className = isDarkMode ? 'dark' : 'light';
//     console.log(`主题已切换至${isDarkMode ? '深色' : '浅色'}模式`);
//   }, [isDarkMode]);

//   // 记忆化回调函数
//   const handleIncrement = useCallback(() => {
//     setCounter(prev => prev + 1);
//   }, []);

//   const handleToggleTheme = useCallback(() => {
//     setIsDarkMode(prev => !prev);
//   }, []);

//   // 渲染内容区域
//   const renderContent = () => {
//     if (loading) {
//       return (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
//           <span className="ml-4 text-lg">加载数据中...</span>
//         </div>
//       );
//     }

//     return (
//       <div className="max-w-4xl mx-auto p-6 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-xl backdrop-blur-sm">
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
//             {isDarkMode ? '探索数字世界' : '欢迎来到创意空间'}
//           </h1>
//           <p className="text-gray-600 dark:text-gray-300 text-lg">
//             一个融合技术与设计的前沿平台
//           </p>
//         </div>

//         {userData && (
//           <div className="mb-8">
//             <div className="flex items-center mb-6">
//               <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
//               <div className="ml-4">
//                 <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
//                   你好, {userData.name}
//                 </h2>
//                 <p className="text-gray-600 dark:text-gray-300">
//                   {userData.bio}
//                 </p>
//               </div>
//             </div>
            
//             <div className="grid grid-cols-3 gap-4 mb-6">
//               <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-lg text-center">
//                 <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">
//                   {userData.stats.projects}
//                 </div>
//                 <div className="text-gray-600 dark:text-gray-300">项目</div>
//               </div>
//               <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-lg text-center">
//                 <div className="text-2xl font-bold text-green-600 dark:text-green-300">
//                   {userData.stats.experience}
//                 </div>
//                 <div className="text-gray-600 dark:text-gray-300">年经验</div>
//               </div>
//               <div className="bg-purple-100 dark:bg-purple-900/50 p-4 rounded-lg text-center">
//                 <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">
//                   {userData.stats.skills}
//                 </div>
//                 <div className="text-gray-600 dark:text-gray-300">项技能</div>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//           <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
//             <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
//               互动演示
//             </h3>
//             <div className="flex items-center">
//               <span className="text-gray-600 dark:text-gray-300 mr-4">计数器: {counter}</span>
//               <button 
//                 onClick={handleIncrement}
//                 className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
//               >
//                 增加
//               </button>
//             </div>
//           </div>
          
//           <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
//             <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
//               主题设置
//             </h3>
//             <button 
//               onClick={handleToggleTheme}
//               className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
//             >
//               切换到{isDarkMode ? '浅色' : '深色'}模式
//             </button>
//           </div>
//         </div>

//         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl">
//           <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">功能特性</h2>
//           <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <li className="flex items-start">
//               <span className="text-green-500 mr-2">✓</span>
//               <span className="text-gray-700 dark:text-gray-300">响应式设计适配所有设备</span>
//             </li>
//             <li className="flex items-start">
//               <span className="text-green-500 mr-2">✓</span>
//               <span className="text-gray-700 dark:text-gray-300">动态主题切换与自定义</span>
//             </li>
//             <li className="flex items-start">
//               <span className="text-green-500 mr-2">✓</span>
//               <span className="text-gray-700 dark:text-gray-300">高性能流体动画背景</span>
//             </li>
//             <li className="flex items-start">
//               <span className="text-green-500 mr-2">✓</span>
//               <span className="text-gray-700 dark:text-gray-300">现代化UI与交互体验</span>
//             </li>
//             <li className="flex items-start">
//               <span className="text-green-500 mr-2">✓</span>
//               <span className="text-gray-700 dark:text-gray-300">实时数据加载与状态管理</span>
//             </li>
//             <li className="flex items-start">
//               <span className="text-green-500 mr-2">✓</span>
//               <span className="text-gray-700 dark:text-gray-300">优雅的错误处理机制</span>
//             </li>
//           </ul>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className={`min-h-screen flex flex-col relative ${isDarkMode ? 'dark' : ''}`}>
//       {/* 背景动画 - 使用React.memo缓存 */}
//       <MemoizedBackground isDarkMode={isDarkMode} />
      
//       {/* 头部 */}
//       <div className="relative z-10">
//         <Header />
//       </div>
      
//       {/* 主要内容 */}
//       <main className="flex-1 py-10 relative z-10">
//         <div className="container mx-auto px-4">
//           {renderContent()}
//         </div>
//       </main>
      
//       {/* 页脚 */}
//       <div className="relative z-10">
//         <Footer title="联系我们" />
//       </div>
//     </div>
//   );
// }
// 引入
// import Footer from '@/components/footer/footer'
// import Header from '@/components/header/header'
// import LiquidEther from './LiquidEther/LiquidEther'
// import { useState, useEffect, useCallback } from 'react'

// export default function HomePage() {
//   // useState 示例 - 管理组件状态
//   const [info, setInfo] = useState<string>('欢迎来到我的主页')
//   const [counter, setCounter] = useState<number>(0)
//   const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
//   const [userData, setUserData] = useState<any>(null)
//   const [loading, setLoading] = useState<boolean>(true)

//   // useEffect 示例 - 处理副作用
//   useEffect(() => {
//     // 组件挂载时执行
//     console.log('组件已加载')

//     // 模拟数据获取
//     const fetchData = async () => {
//       setLoading(true)
//       try {
//         // 这里是模拟API调用
//         const response = await new Promise((resolve) =>
//           setTimeout(
//             () => resolve({ name: '用户', bio: '这是我的个人主页' }),
//             1500,
//           ),
//         )
//         setUserData(response)
//       } catch (error) {
//         console.error('获取数据失败:', error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()

//     // 清除函数 (组件卸载时执行)
//     return () => {
//       console.log('组件即将卸载')
//     }
//   }, []) // 空依赖数组表示只在组件挂载时执行

//   // 使用useEffect监听状态变化
//   useEffect(() => {
//     document.body.className = isDarkMode ? 'dark' : 'light'
//     console.log('主题已切换:', isDarkMode ? '深色模式' : '浅色模式')
//   }, [isDarkMode]) // 依赖数组包含isDarkMode，当它变化时执行

//   // useCallback 示例 - 记忆化函数
//   const handleIncrement = useCallback(() => {
//     setCounter((prev) => prev + 1)
//   }, []) // 空依赖数组表示函数不会改变

//   const handleToggleTheme = useCallback(() => {
//     setIsDarkMode((prev) => !prev)
//   }, [])

//   // 条件渲染示例
//   const renderContent = () => {
//     if (loading) {
//       return <div className="loading-spinner">加载中...</div>
//     }

//     return (
//       <div className="content">
//         <h1>{info}</h1>
//         <p>这是我的个人网站，展示我的项目和想法</p>

//         {userData && (
//           <div className="user-info">
//             <h2>欢迎, {userData.name}</h2>
//             <p>{userData.bio}</p>
//           </div>
//         )}

//         <div className="counter-section">
//           <p>计数器: {counter}</p>
//           <button onClick={handleIncrement}>增加</button>
//         </div>

//         <div className="theme-section">
//           <button onClick={handleToggleTheme}>
//             切换到{isDarkMode ? '浅色' : '深色'}模式
//           </button>
//         </div>

//         <div className="features">
//           <h2>功能特性</h2>
//           <ul>
//             <li>响应式设计</li>
//             <li>动态主题切换</li>
//             <li>交互式组件</li>
//             <li>现代化UI</li>
//           </ul>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className={`home-container ${isDarkMode ? 'dark' : 'light'} flex flex-col min-h-screen w-[100%] relative`}>
//        {/* 液体背景效果 */}
//         <div className="liquid-background h-full w-full absolute top-0 left-0 z-0 ">
//           <LiquidEther
//             style={{
//               height: '100%',
//               width: '100%',
//               position: 'absolute',
//               top: 0,
//               left: 0,
//               zIndex: -1,
//             }}
//             colors={
//               isDarkMode
//                 ? ['#2D00F7', '#6A00F4', '#8900F2']
//                 : ['#5227FF', '#FF9FFC', '#B19EEF']
//             }
//             mouseForce={20}
//             cursorSize={100}
//             isViscous={true}
//             viscous={30}
//             iterationsViscous={32}
//             iterationsPoisson={32}
//             resolution={0.5}
//             isBounce={false}
//             autoDemo={true}
//             autoSpeed={0.5}
//             autoIntensity={2.2}
//             takeoverDuration={0.25}
//             autoResumeDelay={500}
//             autoRampDuration={0.6}
//           />
//         </div>
//       <div className="header-section h-[50px]">
//         <Header />
//       </div>
//       <div className=" flex-1 relative">
       

//         {/* 主要内容 */}
//         <div className="content-overlay">{renderContent()}</div>
//       </div>

//       <div className="footer-section h-[200px]">
//         <Footer title="联系我们" />
//       </div>
//     </div>
//   )
// }

// import Footer from '@/components/footer/footer'
// import Header from '@/components/header/header'
// import LiquidEther from './LiquidEther/LiquidEther'
// export default function HomePage() {
//   const [info, setInfo] = useState<string>('我是首页')

//   return (
//     <div className="w-[100%] min-h-screen flex flex-col ">
//       <div className="h-[50px] w-[100%]">
//         <Header></Header>
//       </div>
//       <div className=" relative  flex-1">
//         {Array.from({ length: 30 }).map((_, index) => (
//           <div key={index}>{info}</div>
//         ))}

//       </div>
//       <div className="h-[100px] w-[100%]">
//         <Footer title="我是"></Footer>
//       </div>
//     </div>
//   )
// }
//  {/* 测试特效 */}
//         {false&&<div
//           style={{
//             width: '100%',
//             height: '100%',
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             zIndex: -1,
//           }}
//         >
//           <LiquidEther
//             // colors={['#5227FF', '#FF9FFC', '#B19EEF']}
//             // mouseForce={20}
//             // cursorSize={100}
//             // isViscous={true}
//             // viscous={30}
//             // iterationsViscous={32}
//             // iterationsPoisson={32}
//             // resolution={0.5}
//             // isBounce={false}
//             // autoDemo={true}
//             // autoSpeed={0.5}
//             // autoIntensity={2.2}
//             // takeoverDuration={0.25}
//             // autoResumeDelay={500}
//             // autoRampDuration={0.6}
//             // BFECC={true}
//             // 必须启用自动演示才能激活整个系统
//             autoDemo={true} // 保持开启
//             autoSpeed={0.1} // 大幅降低自动演示速度
//             autoIntensity={0.5} // 大幅降低自动演示强度
//             mouseForce={80} // 大幅提高鼠标影响力
//             cursorSize={100} // 增大鼠标影响范围
//             takeoverDuration={0.05} // 极短的鼠标接管时间
//             autoResumeDelay={1} // 很长的自动演示恢复延迟
//             // 物理参数优化
//             isViscous={true} // 关闭粘性，获得更流畅的响应
//             viscous={15} // 降低粘性系数
//             iterationsViscous={24} // 适当减少迭代次数
//             iterationsPoisson={24} // 适当减少迭代次数
//             resolution={0.6} // 适当提高分辨率
//             isBounce={true} // 启用边界反弹
//             // 自动演示参数（削弱自动效果）
//             autoRampDuration={0.8} // 增加过渡时间
//             // 其他参数
//             colors={['#5227FF', '#FF9FFC', '#B19EEF']}
//             dt={0.014}
//             BFECC={true}
//             style={{}}
//             className=""
//           />
//         </div>}

import React, { useState, useMemo } from "react";

/**
 * useContext 使用示例 - Context 创建和 Provider
 * 
 * 步骤：
 * 1. 使用 createContext 创建 Context
 * 2. 创建 Provider 组件，使用 useState 管理状态
 * 3. 使用 useMemo 优化 value，避免不必要的重渲染
 * 4. 在子组件中使用 useContext 获取数据
 */

// 定义数据类型
interface Content {
  content: string;
  id?: string;
  desc?: string;
}

// Provider 组件的 props 类型
interface ContentProviderProps {
  children: React.ReactNode;
}

// 1. 创建 Context
// 注意：初始值设为 null，这样可以在使用时进行空值检查
export const Mycontent = React.createContext<{
  content: Content;
  setContent: React.Dispatch<React.SetStateAction<Content>>;
} | null>(null);

// 2. 创建 Provider 组件
export default function ContentProvider({ children }: ContentProviderProps) {
  // 使用 useState 管理状态
  const [content, setContent] = useState<Content>({ content: '测试content' });

  // ⚠️ 重要：使用 useMemo 优化 value
  // 如果不使用 useMemo，每次组件重新渲染时都会创建新的对象
  // 这会导致所有消费该 Context 的子组件都重新渲染，即使数据没有变化
  const value = useMemo(
    () => ({ content, setContent }),
    [content] // 依赖项：只有当 content 变化时才重新创建对象
  );

  return (
    <Mycontent.Provider value={value}>
      {children}
    </Mycontent.Provider>
  );
}
// import React, { createContext, useState, ReactNode } from "react";

// // 1. 定义类型
// export interface Content {
//   content: string;
//   id?: string;
//   desc?: string;
// }

// // 2. 创建Context并导出
// export const ContentContext = createContext<{
//   content: Content;
//   setContent: React.Dispatch<React.SetStateAction<Content>>;
// } | null>(null); // 初始值设为null避免类型问题

// // 3. 创建Provider组件
// export default function ContentProvider({ children }: { children: ReactNode }) {
//   // 4. 在组件内部使用useState
//   const [content, setContent] = useState<Content>({ content: '测试content' });

//   return (
//     <ContentContext.Provider value={{ content, setContent }}>
//       {children}
//     </ContentContext.Provider>
//   );
// }
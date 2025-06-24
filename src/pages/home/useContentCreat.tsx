import React, { useState } from "react";
// 默认值
interface Content {
    content:string;
    id?:string,
    desc?:string
}
interface ContentProviderProps {
  children: React.ReactNode; // 定义 children prop 的类型为 ReactNode
}
 export  const Mycontent=React.createContext<{
  content: Content;
  setContent: React.Dispatch<React.SetStateAction<Content>>;
} | null>(null); 
export default function ContentProvider({children}:ContentProviderProps){
const [content,setContent]=useState<Content>({content:'测试content'})
    return (
        <Mycontent.Provider value={{content,setContent}}>
            {children}
        </Mycontent.Provider>
    )
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
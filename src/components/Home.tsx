// export default function Home() {
//     return <div
//   >Home Page: List of technical blogs</div>
//   }
import React from 'react';

// 如果有 props，可以定义一个类型
interface HomeProps {
  // 这里定义 your prop types
}

const Home: React.FC<HomeProps> = () => {
  return <h1>Welcome to Home Page</h1>;
};

export default Home;
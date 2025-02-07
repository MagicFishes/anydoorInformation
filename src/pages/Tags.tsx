import React from 'react';

// 如果有 props，可以定义一个类型
interface HomeProps {
  // 这里定义 your prop types
}

const Tags: React.FC<HomeProps> = () => {
  return <h1>Welcome to Tags Page</h1>;
};

export default Tags;
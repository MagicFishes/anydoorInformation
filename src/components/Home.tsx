// export default function Home() {
//     return <div
//   >Home Page: List of technical blogs</div>
//   }
// import React from 'react';

// // 如果有 props，可以定义一个类型
// interface HomeProps {
//   // 这里定义 your prop types
//   title:string
// }

// const Home: React.FC<HomeProps> = ({title}) => {
//   return <h1>Welcome to Home Page12{title}</h1>;
// };

// export default Home;
import React, { useEffect, useState }  from 'react'
interface homeProps{
    title1:string
  }
interface MyHomeState {
  title: string;
}
// 类组件生命周期

// props    state
// class MyHome extends React.Component<homeProps, MyHomeState>{
  
//   constructor(props: homeProps){
//     super(props)
//     this.state = { title: '' }
//     console.log("1,初始化")
//   }
//   componentDidMount(){
//     console.log("2，挂载")
//     setTimeout(()=>{
//       this.setState({ title: '2,挂载' })
//     },1000)
//   }
//   shouldComponentUpdate(nextProps: Readonly<homeProps>, nextState: Readonly<MyHomeState>, nextContext: any): boolean {
//     return true
//   }
//   componentDidUpdate(prevProps: Readonly<homeProps>, prevState: Readonly<MyHomeState>, snapshot?: any): void {
    
//   }
//   componentWillUnmount(): void {
//     // 清除定时器
//   }

//   render(): React.ReactNode {
//     return <div>woshiHome</div>
//   }
// }

// export default MyHome;


// hooks  替换生命周期

function Counter(){
  const [count,setCount]=useState(0)//初始化 
  
  // update 
  const increment=()=>{
    setCount(prev => {
      console.log("prev", prev)
      return prev + 1
      // 对象类型需手动合并：setUser(prev => ({ ...prev, age: 25 }))
    }) // 异步更新
    console.log(count, " 旧值")
  }

//副作用  类似watch
  useEffect(()=>{
    //componentDidMount 挂载+ componentDidUpdate 修改 
    console.log("副作用执行")
    return ()=>{
      //componentWillUnmount
      console.log("清理副作用")
    }
  },[count])
  

//跨组件通信 useContext
// 创建Context
// const ThemeContext = React.createContext('light');

// // 提供数据
// <ThemeContext.Provider value="dark">
//   <ChildComponent />
// </Provider>

// // 子组件消费
// const theme = useContext(ThemeContext); // 获取值



}
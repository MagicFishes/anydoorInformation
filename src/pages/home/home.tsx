import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from './home.module.css'
import classNames from 'classnames'
// 类型定义放在组件外部（避免重复声明）
interface ButtonProps {
  text: string
  onClick: (event: React.MouseEvent) => void
  disabled?: boolean
  variant?: 'primary' | number 
}

interface WelcomeProps {
  title: string
}

// 组件定义放在外部（避免重复渲染重建）
// const T = ({ text, onClick, disabled }: ButtonProps) => (
//   <button onClick={onClick} disabled={disabled}>
//     {text}
//   </button>
// )

// 外部组件定义
const T = ({ text, onClick, disabled, variant = 'primary' }: ButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded ${
      variant === 'primary'
        ? 'bg-blue-500 text-white hover:bg-blue-600'
        : 'bg-gray-200 hover:bg-gray-300'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {text}
  </button>
)
const Welcome = ({ title }: WelcomeProps) => {
  // ✅ 正确：在函数组件顶层使用 Hook
  const [isActive, setIsActive] = useState(false)
  useEffect(() => {
    console.log('Welcome mounted')
  }, [])
  return <div className={classNames('w-[20px] h-[20px] bg-black')}>{title}</div>
}

// 计数器组件（新增示例1）
const Counter = ({
  value,
  onIncrement,
  onDecrement,
}: {
  value: number
  onIncrement: () => void
  onDecrement: () => void
}) => (
  <div className="flex items-center space-x-4 my-4">
    <button
      onClick={onDecrement}
      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
    >
      -
    </button>
    <span className="text-xl font-bold">{value}</span>
    <button
      onClick={onIncrement}
      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
    >
      +
    </button>
  </div>
)

// 待办事项组件（新增示例2）
const TodoItem = ({
  text,
  completed,
  onToggle,
  onDelete,
}: {
  text: string
  completed: boolean
  onToggle: () => void
  onDelete: () => void
}) => (
  <div
    className={`flex items-center justify-between p-2 border-b ${completed ? 'bg-green-50' : ''}`}
  >
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={completed}
        onChange={onToggle}
        className="mr-2"
      />
      <span className={completed ? 'line-through text-gray-500' : ''}>
        {text}
      </span>
    </div>
    <button onClick={onDelete} className="text-red-500 hover:text-red-700">
      删除
    </button>
  </div>
)
const HomeUseMemo1 = React.memo(
  ({ onClick }: { onClick: React.MouseEventHandler<HTMLButtonElement> }) => {
    console.log('HomeUseMemo1 渲染了!')
    return <button onClick={onClick}>点击我</button>
  },
)
const HomeUseMemo2 = React.memo(() => {
  console.log('重新渲染homeusememo')
  return <div>HomeUseMemo 示例</div>
})
export default function HomePage() {
  //   // ✅ 正确：Hook 在函数组件内部调用
  //   const [title, setTitle] = useState('welcome')
  //   const divRef = useRef<HTMLDivElement>(null)

  //   // ✅ 正确：事件处理函数在组件内部
  //   const handleClick = (e: React.MouseEvent) => {
  //     console.log('click event', e)
  //     setTitle('123')
  //   }

  //   // ✅ 正确：JSX元素在组件内部定义（可以响应状态变化）
  //   const element = <h1>123</h1>
  //   const element1 = <div>456</div>

  //   // ✅ 正确：useEffect 在组件内部
  //   useEffect(() => {
  //     console.log('divRef DOM:', divRef.current)

  //     // 安全操作 DOM
  //     if (divRef.current) {
  //       divRef.current.style.border = '2px solid red'
  //     }
  //   }, []) // 空依赖数组 = 只在挂载时执行一次

  //   return (
  //     <div
  //       className={classNames(
  //         styles['local-btn'],
  //         'p-6 bg-red-600', // 修正无效的 bg-[red] 写法
  //       )}
  //     >
  //       <T
  //         text="按钮"
  //         onClick={handleClick} // 直接传递函数引用
  //       />
  //       我是首页
  //       {element}
  //       {true ? element : element1}
  //       <Welcome title={title} />
  //       {/* 绑定 ref 的 DOM 元素 */}
  //       <div ref={divRef} className="h-10 w-10 bg-yellow-300"></div>
  //     </div>
  //   )

  const [title, setTitle] = useState('welcome')
  const divRef = useRef<HTMLDivElement>(null)

  // 示例1状态：计数器（父子组件共享状态）
  const [count, setCount] = useState(0)

  // 示例2状态：待办事项列表
  const [todos, setTodos] = useState([
    { id: 1, text: '学习React Hooks', completed: true },
    { id: 2, text: '实现状态提升', completed: false },
  ])
  const [newTodo, setNewTodo] = useState('')

  // 使用useCallback记忆函数（优化性能）
  const handleIncrement = useCallback(() => setCount((c) => c + 1), [])
  const handleDecrement = useCallback(
    () => setCount((c) => Math.max(0, c - 1)),
    [],
  )

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      console.log('click event', e)
      setTitle(title === 'welcome' ? '已更新!' : 'welcome')
    },
    [title],
  )

  // 添加待办事项
  const addTodo = useCallback(() => {
    if (newTodo.trim()) {
      setTodos((prev) => [
        ...prev,
        { id: Date.now(), text: newTodo.trim(), completed: false },
      ])
      setNewTodo('')
    }
  }, [newTodo])

  // 切换完成状态
  const toggleTodo = useCallback((id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }, [])

  // 删除待办事项
  const deleteTodo = useCallback((id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }, [])

  useEffect(() => {
    console.log('divRef DOM:', divRef.current)
    if (divRef.current) {
      divRef.current.style.border = '2px solid red'
    }
  }, [])

  // ✅ 使用 useCallback - 函数引用稳定
  const handleClick1 = useCallback(() => {
    console.log('点击')
  }, [])
  return (
    <div className={classNames(styles['local-btn'], 'p-6 ')}>
      <T text="点击更新标题" onClick={handleClick} variant="primary" />

      <div className="my-6 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-2">
          示例1: 计数器组件（状态提升）
        </h2>
        <Counter
          value={count}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
        />
        <div className="text-sm text-gray-600">
          当前计数: {count} | 状态
          {count > 5 ? '偏高' : count < 2 ? '偏低' : '正常'}
        </div>
      </div>

      <div className="my-6 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-2">示例2: 待办事项列表</h2>
        <div className="flex mb-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="添加新任务..."
            className="flex-1 p-2 border rounded-l"
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
          >
            添加
          </button>
        </div>

        <div className="border rounded">
          {todos.length > 0 ? (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                text={todo.text}
                completed={todo.completed}
                onToggle={() => toggleTodo(todo.id)}
                onDelete={() => deleteTodo(todo.id)}
              />
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">没有待办事项</div>
          )}
        </div>
        <div className="mt-2 text-sm text-gray-600">
          已完成: {todos.filter((t) => t.completed).length}/{todos.length}
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">当前标题状态:</h3>
        <Welcome title={title} />
      </div>

      <div ref={divRef} className="h-10 w-10 bg-yellow-300 mt-4 mx-auto"></div>
      <div ></div>
      <HomeUseMemo1 onClick={handleClick1} />
      <HomeUseMemo2  />
    </div>
  )
}

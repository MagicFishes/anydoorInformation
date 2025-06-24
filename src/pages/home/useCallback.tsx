import React, { useState, useCallback, useRef, useEffect } from 'react'

function MyComponent() {
  const [count, setCount] = useState(0)

  // 每次渲染都会创建一个新的函数实例
  const handleClick1 = () => {
    console.log('Button 1 clicked')
    setCount(count + 1)
  }

  // 使用 useCallback 缓存函数实例
  const handleClick2 = useCallback(() => {
    console.log('Button 2 clicked')
    setCount(count + 1)
  }, [])
  const handleClickRef = useRef<(() => void) | null>(null)
  const handleClick = useCallback(() => {
    console.log('Button clicked')
    setCount(count + 1)
  }, [count])

  useEffect(() => {
    if (handleClickRef.current === null) {
      handleClickRef.current = handleClick2
      console.log('handleClick 首次创建', handleClickRef)
    } else if (handleClickRef.current !== handleClick2) {
      console.log('handleClick 被重建')
      handleClickRef.current = handleClick2
    }
  }, [handleClick2])
  return (
    <div>
      <button onClick={handleClick1}>Click Me 1</button>
      <button onClick={handleClick2}>Click Me 2</button>
      <button onClick={handleClick}>Click Me 3</button>
      <p>Count: {count}</p>
    </div>
  )
}
export default MyComponent

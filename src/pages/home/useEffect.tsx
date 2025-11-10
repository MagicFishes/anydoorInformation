import React, { useEffect, useState } from 'react'

const MountEffectDemo: React.FC = () => {
  const [data, setData] = useState<string>('加载中...')

  useEffect(() => {
    const timer = setTimeout(() => {
      setData('接口数据：useEffect 在组件挂载后执行一次')
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section>
      <h3>1. 组件挂载时执行（依赖数组为空）</h3>
      <p>适合做初始化请求、订阅等一次性的副作用。</p>
      <div className="demo-card">
        <p>{data}</p>
      </div>
    </section>
  )
}

const DependencyEffectDemo: React.FC = () => {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('')

  useEffect(() => {
    setMessage(`副作用响应到 count 变化：${count}`)
  }, [count])

  return (
    <section>
      <h3>2. 依赖状态变化时执行（依赖数组有值）</h3>
      <p>依赖数组里的变量变化时才重新运行，避免不必要的副作用。</p>
      <div className="demo-card">
        <p>{message || '点击按钮看看效果'}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            className="rounded-md bg-blue-500 px-4 py-2 text-white shadow transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
            onClick={() => setCount((prev) => prev + 1)}
          >
            count + 1
          </button>
          <button
            className="rounded-md bg-slate-100 px-4 py-2 text-slate-700 shadow transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-1"
            onClick={() => setCount(0)}
          >
            重置
          </button>
        </div>
      </div>
    </section>
  )
}

const CleanupEffectDemo: React.FC = () => {
  const [width, setWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 0
  )

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <section>
      <h3>3. 清理副作用（返回清理函数）</h3>
      <p>在下次副作用执行前或组件卸载时执行清理逻辑。</p>
      <div className="demo-card">
        <p>当前窗口宽度：{width}px</p>
        <p>尝试拖动浏览器窗口，观察宽度变化。</p>
      </div>
    </section>
  )
}

const RenderEffectDemo: React.FC = () => {
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>(['初始渲染'])

  useEffect(() => {
    setHistory((prev) => {
      const last = prev[prev.length - 1]
      const current = `渲染后输入框的值：${value || '（空）'}`
      if (last === current) {
        return prev
      }
      return [...prev, current]
    })
  })

  return (
    <section>
      <h3>4. 每次渲染后执行（省略依赖数组）</h3>
      <p>谨慎使用，适合做同步 DOM 的场景，注意避免死循环。</p>
      <div className="demo-card">
        <label>
          输入框：
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="随便输入点什么"
          />
        </label>
        <p>记录到的渲染次数：{history.length}</p>
        <p>渲染历史：</p>
        <ul>
          {history.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const UseEffectPage: React.FC = () => {
  useEffect(() => {
    const originalTitle = document.title
    document.title = 'useEffect 学习示例'

    return () => {
      document.title = originalTitle
    }
  }, [])

  return (
    <div className="page use-effect-page p-[5rem]">
      <header>
        <h2>useEffect 基本使用案例</h2>
        <p>
          useEffect 让我们在函数组件中处理副作用：数据获取、事件订阅、手动操作 DOM
          等。下面通过四个常见场景快速回顾它的用法。
        </p>
      </header>

      <main className="demo-grid">
        <MountEffectDemo />
        <DependencyEffectDemo />
        <CleanupEffectDemo />
        <RenderEffectDemo />
      </main>
    </div>
  )
}

export default UseEffectPage


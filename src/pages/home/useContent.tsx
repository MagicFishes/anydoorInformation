import React, { useContext } from 'react'
import ContentProvider, { Mycontent } from './useContentCreat'

/**
 * useContext Hook 使用示例
 * 
 * useContext 的作用：
 * - 允许组件订阅 React Context 的值
 * - 避免通过 props 逐层传递数据（避免 prop drilling）
 * - 当 Context 的值更新时，使用 useContext 的组件会自动重新渲染
 */

// 子组件：使用 useContext 获取数据
function ContentDisplay() {
  // 使用 useContext 获取 Context 的值
  const context = useContext(Mycontent)

  // ⚠️ 重要：进行空值检查
  // 如果组件没有被 Provider 包裹，context 会是 null
  if (!context) {
    return <div style={{ color: 'red' }}>⚠️ 请确保组件被 ContentProvider 包裹</div>
  }

  // 解构使用
  const { content, setContent } = context

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h2>内容显示组件</h2>
      <p>当前内容：{content.content}</p>
      {content.id && <p>ID: {content.id}</p>}
      {content.desc && <p>描述: {content.desc}</p>}
      <button 
        onClick={() => setContent({ 
          content: '更新后的内容',
          id: Date.now().toString(),
          desc: '这是更新后的描述'
        })}
        style={{ marginTop: '10px', padding: '8px 16px' }}
      >
        更新内容
      </button>
    </div>
  )
}

// 另一个子组件：展示多个组件可以共享同一个 Context
function ContentEditor() {
  const context = useContext(Mycontent)

  if (!context) {
    return null
  }

  const { content, setContent } = context

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent({
      ...content,
      content: e.target.value
    })
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h2>内容编辑组件</h2>
      <input
        type="text"
        value={content.content}
        onChange={handleChange}
        placeholder="输入新内容"
        style={{ padding: '8px', width: '300px' }}
      />
      <p style={{ marginTop: '10px', color: '#666' }}>
        提示：这个组件和上面的显示组件共享同一个 Context，修改这里的内容，上面的组件会自动更新
      </p>
    </div>
  )
}

// 中间层组件：展示 Context 可以跨层级传递
function MiddleComponent() {
  return (
    <div style={{ padding: '20px', background: '#f5f5f5', margin: '10px' }}>
      <h3>中间层组件（不需要传递 props）</h3>
      <ContentDisplay />
      <ContentEditor />
    </div>
  )
}

// 主组件：使用 Provider 包裹需要共享数据的组件树
export default function UseContent() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>useContext Hook 示例</h1>
      <div style={{ marginBottom: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '8px' }}>
        <h3>📚 知识点说明：</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>作用：</strong>在组件树中跨层级传递数据，避免 prop drilling</li>
          <li><strong>使用步骤：</strong>createContext → Provider → useContext</li>
          <li><strong>注意事项：</strong>使用 useMemo 优化 value，进行空值检查</li>
        </ul>
      </div>

      {/* 使用 Provider 包裹组件树 */}
      <ContentProvider>
        <div style={{ border: '2px solid #2196f3', padding: '20px', borderRadius: '8px' }}>
          <h2>Provider 包裹的区域</h2>
          <MiddleComponent />
        </div>
      </ContentProvider>

      {/* 未包裹 Provider 的组件，会显示错误提示 */}
      <div style={{ marginTop: '20px', border: '2px dashed #f44336', padding: '20px', borderRadius: '8px' }}>
        <h2>未包裹 Provider 的区域</h2>
        <ContentDisplay />
      </div>
    </div>
  )
}

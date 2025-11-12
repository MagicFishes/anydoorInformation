import React, { useActionState, useState, useEffect } from 'react'
// useActionState 这个 Hook 在示例页里扮演“动作状态管理器”的角色：它把提交反馈的异步逻辑与表单状态绑在一起，让表单在提交时拥有天然的“正在提交”“提交结果”等信息，省去了手写 useState 管理各种 loading / success / error 状态的麻烦。
// 统一管理动作结果：useActionState 返回 [feedbackState, formAction, isPending]，其中 feedbackState 就是上一次提交返回的数据，用来渲染成功/失败提示；isPending 在请求过程中自动变为 true，方便禁用按钮或显示 “提交中…”。
// 自动接收 FormData 并执行异步逻辑：formAction 直接挂到 <form action={formAction}>，React 会把表单提交产生的 FormData 传给 submitFeedback。在返回之前，可做校验、异步请求等操作。
// 异步校验与提示：示例里的 submitFeedback 函数先做字段校验，再模拟异步请求，最后返回成功或失败的 FeedbackState，直接反映到 UI 上。
// 这里的第二个参数相当于 useActionState 的初始 state。它会在页面首次渲染时赋值给 feedbackState，让你有一个明确的默认状态（比如 status: 'idle'、message: ''），并在每次 action 成功返回结果后才会被覆盖。如果省略这个参数，feedbackState 起初就是 undefined，渲染时就得额外做判空处理。
// 总结：useActionState 用来封装“动作（如表单提交）”的执行、状态和结果，让你在 React 19 里以更声明的方式构建交互式表单。
type FeedbackState =
  | { status: 'idle'; message: '' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string }

async function submitFeedback(_: FeedbackState, formData: FormData): Promise<FeedbackState> {
  const nickname = String(formData.get('nickname') || '').trim()
  const content = String(formData.get('content') || '').trim()

  if (!nickname) {
    return { status: 'error', message: '请填写昵称～' }
  }

  if (content.length < 10) {
    return { status: 'error', message: '反馈内容至少需要 10 个字符。' }
  }

  await new Promise((resolve) => setTimeout(resolve, 900))

  return {
    status: 'success',
    message: `${nickname} 的反馈已提交，感谢你的建议！`
  }
}

const UseActionStateShowcase: React.FC = () => {
  const [nickname, setNickname] = useState('')
  const [content, setContent] = useState('')
  const [feedbackState, formAction, isPending] = useActionState(submitFeedback, {
    status: 'idle',
    message: ''
  } as FeedbackState)

  useEffect(() => {
    if (feedbackState.status === 'success') {
      setContent('')
    }
  }, [feedbackState])

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: '0 auto', lineHeight: 1.6 }}>
      <h2>useActionState：反馈表单示例</h2>
      <p style={{ color: '#666' }}>
        这个页面通过一个反馈表单演示 <code>useActionState</code> 的基本用法：提交时禁用按钮、展示异步状态，并显示服务端返回的信息。
      </p>

      <form action={formAction} style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontWeight: 600 }}>昵称</span>
          <input
            name="nickname"
            placeholder="请输入昵称"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #d9d9d9' }}
            aria-label="nickname"
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontWeight: 600 }}>反馈内容</span>
          <textarea
            name="content"
            placeholder="请分享你的建议或问题"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={4}
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #d9d9d9',
              resize: 'vertical',
              minHeight: 120
            }}
            aria-label="feedback-content"
          />
        </label>

        <button
          type="submit"
          disabled={isPending}
          style={{
            padding: '12px 18px',
            borderRadius: 8,
            border: 'none',
            background: isPending ? '#91d5ff' : '#1890ff',
            color: '#fff',
            fontSize: 16,
            cursor: isPending ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s ease'
          }}
        >
          {isPending ? '提交中...' : '提交反馈'}
        </button>
      </form>

      <div style={{ marginTop: 24 }}>
        <h3>提交结果</h3>
        {feedbackState.status === 'idle' && <p style={{ color: '#999' }}>暂未提交反馈。</p>}
        {feedbackState.status === 'success' && (
          <p style={{ color: '#389e0d', background: '#f6ffed', padding: '12px 16px', borderRadius: 8 }}>{feedbackState.message}</p>
        )}
        {feedbackState.status === 'error' && (
          <p style={{ color: '#cf1322', background: '#fff1f0', padding: '12px 16px', borderRadius: 8 }}>{feedbackState.message}</p>
        )}
      </div>

      <section style={{ marginTop: 32, color: '#555' }}>
        <h3>关键点总结</h3>
        <ul style={{ marginLeft: 18, listStyle: 'disc', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <li>
            <code>useActionState</code> 返回的 <code>formAction</code> 直接绑定到 <code>&lt;form action /&gt;</code>，自动接收 <code>FormData</code>。
          </li>
          <li>提交过程中可以通过 <code>isPending</code> 控制按钮、展示加载文案。</li>
          <li>返回的 state 既可显示成功提示，也能集中处理校验失败的反馈。</li>
        </ul>
      </section>
    </div>
  )
}

export default UseActionStateShowcase


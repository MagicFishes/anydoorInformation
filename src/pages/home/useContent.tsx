import React, { useContext } from 'react'
import { Mycontent } from './useContentCreat'

export default function UseContent() {
  const context = useContext(Mycontent)
  if (!context) {
    return <div>请确保组件被ContentProvider包裹</div>
  }
  // 解构使用
  const { content, setContent } = context
  return (
    <div>
      <h1>{content.content}</h1>
      <button onClick={() => setContent({ content: '更新后的内容' })}>
        更新内容
      </button>
    </div>
  )
}

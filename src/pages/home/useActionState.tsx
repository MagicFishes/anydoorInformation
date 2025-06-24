"use client";
import classNames from 'classnames';
import React, { useState } from 'react'
import { useActionState } from 'react'

// action 函数：处理表单提交
async function registerUser(prevState: any, formData: any) {
  // 1. 获取表单数据
  const username = formData.get('username')
  const password = formData.get('password')

  // 2. 数据验证
  if (!username || username.length < 3) {
    return { success: false, message: '用户名必须至少包含 3 个字符' }
  }
  if (!password || password.length < 6) {
    return { success: false, message: '密码必须至少包含 6 个字符' }
  }

  // 3. 模拟 API 调用 (替换为实际的注册逻辑)
  await new Promise((resolve) => setTimeout(resolve, 1500)) // 模拟 1.5 秒延迟

  // 4. 模拟注册成功
  return { success: true, message: '注册成功！' }
}

function RegistrationForm() {
    // 使用 useState Hook 保存输入框的值
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // 使用 useActionState Hook
  const [state, formAction, isPending] = useActionState(registerUser, {
    success: false,
    message: '',
  })

  return (
    <div className="form-container">
      <div className="form-card ">
        <form className={classNames('flex flex-col p-[50px]')} action={formAction}>
          <input
            className="form-input"
            type="text"
            name="username"
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
            aria-label="Username"
          />
          <input
            className="form-input"
            type="password"
            name="password"
            placeholder="密码"
            value={password}
            aria-label="Password"
             onChange={(e) => setPassword(e.target.value)}
          />
          <button className="form-button" disabled={isPending}>
            {isPending ? '注册中...' : '注册'}
          </button>
          {state.message && (
            <p
              className={`form-message ${state.success ? 'success' : 'error'}`}
              role="alert"
            >
              {state.message}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}

export default RegistrationForm

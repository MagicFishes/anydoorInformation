import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/**
 * 重定向组件：将PC端路径重定向到移动端，并保留URL参数
 * @param to - 目标路径
 */
interface RedirectWithParamsProps {
  to: string
}

export default function RedirectWithParams({ to }: RedirectWithParamsProps) {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // 获取当前URL的所有参数（包括search和hash）
    const search = location.search // 查询参数，如 ?id=123&name=test
    const hash = location.hash // hash参数，如 #section

    // 构建目标URL，保留所有参数
    const targetUrl = `${to}${search}${hash}`
    
    // 使用 replace 避免在历史记录中留下重定向记录
    navigate(targetUrl, { replace: true })
  }, [location, navigate, to])

  // 返回 null，因为这是一个纯重定向组件
  return null
}


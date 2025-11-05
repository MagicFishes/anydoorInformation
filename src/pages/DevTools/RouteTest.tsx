// 路由测试页面 - 用于测试跨端路径跳转
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { Button, Card, Alert, Space, Typography, Divider } from 'antd'

const { Title, Text, Paragraph } = Typography

export default function RouteTest() {
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useSelector((state: RootState) => state.app.isMobile)
  const [testResult, setTestResult] = useState('')

  // PC 端路径列表
  const pcRoutes = [
    '/admin/home/page',
    '/admin/home/index',
    '/pages/about',
    '/pages/contact'
  ]

  // 移动端路径列表
  const mobileRoutes = [
    '/mobile',
    '/mobile/apps',
    '/mobile/profile'
  ]

  const testNavigation = (path: string) => {
    try {
      navigate(path)
      setTestResult(`尝试跳转到: ${path}`)
    } catch (error) {
      setTestResult(`跳转失败: ${error}`)
    }
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card>
        <Title level={2}>🧪 路由跨端测试工具</Title>
        
        {/* 当前状态 */}
        <Alert
          message="当前状态"
          description={
            <Space direction="vertical" className="w-full">
              <Text>设备类型: <strong>{isMobile ? '📱 移动端' : '🖥️ PC端'}</strong></Text>
              <Text>窗口宽度: <strong>{window.innerWidth}px</strong></Text>
              <Text>当前路径: <strong>{location.pathname}</strong></Text>
              <Text>断点阈值: <strong>768px</strong></Text>
            </Space>
          }
          type="info"
          showIcon
        />

        <Divider />

        {/* 测试说明 */}
        <Paragraph>
          <Text strong>测试方法：</Text>
          <ul>
            <li>当前你在 {isMobile ? '移动端' : 'PC端'}</li>
            <li>尝试点击下方按钮跳转到 {isMobile ? 'PC端' : '移动端'} 路径</li>
            <li>观察会发生什么（正常显示 or 404）</li>
          </ul>
        </Paragraph>

        <Divider />

        {/* PC 端路径测试 */}
        <Title level={4}>🖥️ 测试跳转到 PC 端路径</Title>
        <Space wrap>
          {pcRoutes.map(route => (
            <Button
              key={route}
              onClick={() => testNavigation(route)}
              type={isMobile ? 'primary' : 'default'}
              danger={isMobile}
            >
              {route}
              {isMobile && ' ⚠️'}
            </Button>
          ))}
        </Space>

        {isMobile && (
          <Alert
            message="⚠️ 警告"
            description="你当前在移动端，点击这些 PC 路径会显示 404 页面！"
            type="warning"
            showIcon
            style={{ marginTop: 16 }}
          />
        )}

        <Divider />

        {/* 移动端路径测试 */}
        <Title level={4}>📱 测试跳转到移动端路径</Title>
        <Space wrap>
          {mobileRoutes.map(route => (
            <Button
              key={route}
              onClick={() => testNavigation(route)}
              type={!isMobile ? 'primary' : 'default'}
              danger={!isMobile}
            >
              {route}
              {!isMobile && ' ⚠️'}
            </Button>
          ))}
        </Space>

        {!isMobile && (
          <Alert
            message="⚠️ 警告"
            description="你当前在 PC 端，点击这些移动端路径会显示 404 页面！"
            type="warning"
            showIcon
            style={{ marginTop: 16 }}
          />
        )}

        <Divider />

        {/* 测试结果 */}
        {testResult && (
          <Alert
            message="测试结果"
            description={testResult}
            type="success"
            closable
            onClose={() => setTestResult('')}
          />
        )}

        <Divider />

        {/* 解决方案提示 */}
        <Alert
          message="💡 解决方案"
          description={
            <Space direction="vertical">
              <Text>1. <strong>添加路由守卫</strong>：检测跨端访问并自动重定向</Text>
              <Text>2. <strong>统一路由表</strong>：让两端都能访问对方的路由（但显示不同 UI）</Text>
              <Text>3. <strong>使用 Hash 路由</strong>：避免刷新 404 问题</Text>
              <Text>4. <strong>服务器配置</strong>：配置重写规则支持 History 模式</Text>
            </Space>
          }
          type="info"
          showIcon
        />

        {/* 动态测试按钮 */}
        <Divider />
        <Title level={4}>🔄 动态测试</Title>
        <Paragraph>
          <Text type="secondary">
            尝试缩小/放大浏览器窗口（跨过 768px 临界点），观察页面会不会自动跳转到 404
          </Text>
        </Paragraph>
        <Button 
          onClick={() => window.dispatchEvent(new Event('resize'))}
          type="dashed"
        >
          手动触发 Resize 事件
        </Button>
      </Card>
    </div>
  )
}


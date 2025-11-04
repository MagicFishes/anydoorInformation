// src/components/SidebarMenu/index.tsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { computerModules } from '@/router/computer'
import { RouteObject } from '@/router/types'

interface SidebarMenuProps {
  collapsed?: boolean
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ collapsed = false }) => {
  const navigate = useNavigate()
  const location = useLocation()
  
  // 从 localStorage 读取展开的菜单项
  const [openKeys, setOpenKeys] = useState<string[]>(() => {
    const cached = localStorage.getItem('sidebarOpenKeys')
    return cached ? JSON.parse(cached) : ['home']
  })

  // 保存展开状态到 localStorage
  useEffect(() => {
    localStorage.setItem('sidebarOpenKeys', JSON.stringify(openKeys))
  }, [openKeys])

  // 初始化时根据当前路由展开对应模块
  useEffect(() => {
    const currentModule = computerModules.find(module => 
      location.pathname.startsWith(`/admin/${module.path}`)
    )
    if (currentModule?.meta?.key && !openKeys.includes(currentModule.meta.key)) {
      setOpenKeys(prev => [...prev, currentModule.meta!.key])
    }
  }, [location.pathname])

  // 切换模块展开/收起
  const toggleModule = (key: string) => {
    setOpenKeys(prev => {
      if (prev.includes(key)) {
        return prev.filter(k => k !== key)
      } else {
        return [...prev, key]
      }
    })
  }

  // 导航到指定路由
  const handleNavigate = (path: string) => {
    navigate(path)
  }

  // 判断路由是否激活
  const isActive = (modulePath: string, childPath?: string) => {
    const fullPath = `/admin/${modulePath}${childPath ? `/${childPath}` : ''}`
    return location.pathname === fullPath
  }

  // 判断模块是否有激活的子路由
  const hasActiveChild = (module: RouteObject) => {
    return module.children?.some(child => 
      child.path && isActive(module.path as string, child.path)
    ) || false
  }

  // 过滤显示的模块（排除 hidden 的）
  const visibleModules = computerModules.filter(m => m.meta && !m.meta.hidden)

  if (collapsed) {
    return (
      <div className="w-full h-full bg-gray-50 border-r border-gray-200">
        <div className="flex flex-col items-center py-4 gap-4">
          {visibleModules.map(module => (
            <div
              key={module.meta!.key}
              onClick={() => toggleModule(module.meta!.key)}
              className={`
                cursor-pointer text-2xl p-2 rounded-lg transition-all
                ${hasActiveChild(module) ? 'bg-blue-100' : 'hover:bg-gray-200'}
              `}
              title={module.meta!.label}
            >
              {module.meta!.icon || '📁'}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-gray-50 border-r border-gray-200 overflow-y-auto flex flex-col">
      <div className="flex-1 p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">导航菜单</h2>
        
        {visibleModules.map(module => {
          const isOpen = openKeys.includes(module.meta!.key)
          const hasActive = hasActiveChild(module)
          
          return (
            <div key={module.meta!.key} className="mb-2">
              {/* 模块标题 */}
              <div
                onClick={() => toggleModule(module.meta!.key)}
                className={`
                  flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer
                  transition-all duration-200
                  ${hasActive ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-700'}
                `}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{module.meta!.icon || '📁'}</span>
                  <span className="font-medium">{module.meta!.label}</span>
                </div>
                <span className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>
                  ▶
                </span>
              </div>

              {/* 子路由列表 */}
              {isOpen && module.children && (
                <div className="ml-6 mt-1 space-y-1">
                  {module.children
                    .filter(child => child.meta && !child.meta.hidden && child.path !== undefined)
                    .map(child => (
                      <div
                        key={child.meta!.key}
                        onClick={() => handleNavigate(`/admin/${module.path}/${child.path}`)}
                        className={`
                          px-3 py-2 rounded-lg cursor-pointer text-sm
                          transition-all duration-200
                          ${isActive(module.path as string, child.path as string)
                            ? 'bg-blue-500 text-white font-medium'
                            : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                          }
                        `}
                      >
                        {child.meta!.label}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SidebarMenu

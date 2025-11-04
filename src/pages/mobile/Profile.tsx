// 移动端个人中心
const MobileProfile = () => {
  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl">
            👤
          </div>
          <div className="ml-4">
            <div className="font-bold text-lg">用户名</div>
            <div className="text-gray-500 text-sm">user@example.com</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow divide-y">
        <div className="p-4 flex items-center justify-between">
          <span>个人信息</span>
          <span className="text-gray-400">→</span>
        </div>
        <div className="p-4 flex items-center justify-between">
          <span>账号设置</span>
          <span className="text-gray-400">→</span>
        </div>
        <div className="p-4 flex items-center justify-between">
          <span>隐私设置</span>
          <span className="text-gray-400">→</span>
        </div>
        <div className="p-4 flex items-center justify-between text-red-500">
          <span>退出登录</span>
          <span>→</span>
        </div>
      </div>
    </div>
  )
}

export default MobileProfile


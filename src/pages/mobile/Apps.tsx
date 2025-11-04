// 移动端应用页面
const MobileApps = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">应用列表</h1>
      <div className="grid grid-cols-3 gap-4">
        {['📱 应用1', '🎮 应用2', '📷 应用3', '🎵 应用4', '📖 应用5', '⚙️ 应用6'].map((app, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl mb-2">{app.split(' ')[0]}</div>
            <div className="text-sm">{app.split(' ')[1]}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MobileApps


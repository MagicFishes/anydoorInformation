// 移动端首页
const MobileHome = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">移动端首页</h1>
      <p className="text-gray-600 mb-4">当前设备：移动端</p>
      <div className="bg-white rounded-lg shadow p-4">
        <p>这是移动端的首页内容</p>
        <p className="mt-2 text-sm text-gray-500">
          缩小浏览器窗口宽度 &lt; 768px 时自动切换到此布局
        </p>
      </div>
    </div>
  )
}

export default MobileHome


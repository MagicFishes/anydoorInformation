import React, { useState } from 'react'
//自定义hook
const useInput=(defaultValue:string)=>{
    const [value,setValue]=useState(defaultValue)
    const bing={
        onChange:(e:React.ChangeEvent<HTMLInputElement>)=>setValue(e.target.value),
        value:value
    }
    const reset = (resetValue: string = '') => setValue(resetValue)
    return [ value, bing, reset ] as const
}
/**
 * useState 实战示例集合
 * 每个示例都可以独立运行，展示不同的 useState 用法
 */

// ==================== 示例 1: 基础计数器 ====================
const BasicCounter = () => {
  const [count, setCount] = useState(0)

  return (
    <div className="p-4 border rounded mb-4">
      <h3 className="text-lg font-semibold mb-2">示例1: 基础计数器</h3>
      <p className="mb-2">当前计数: <span className="text-2xl font-bold text-blue-600">{count}</span></p>
      <div className="space-x-2">
        <button 
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          增加
        </button>
        <button 
          onClick={() => setCount(count - 1)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          减少
        </button>
        <button 
          onClick={() => setCount(0)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          重置
        </button>
      </div>
    </div>
  )
}

// ==================== 示例 2: 函数式更新（解决快速点击问题）====================
const FunctionalUpdateCounter = () => {
  const [count, setCount] = useState(0)

  // ❌ 错误示例：快速点击时可能丢失更新
  const badIncrement = () => {
    setCount(count + 1)
    setCount(count + 1)
    setCount(count + 1)
    // 结果：只增加 1（不是 3）
  }

  // ✅ 正确示例：使用函数式更新
  const goodIncrement = () => {
    setCount(prev => prev + 1)
    setCount(prev => prev + 1)
    setCount(prev => prev + 1)
    // 结果：增加 3
  }

  return (
    <div className="p-4 border rounded mb-4">
      <h3 className="text-lg font-semibold mb-2">示例2: 函数式更新 vs 直接更新</h3>
      <p className="mb-2">当前计数: <span className="text-2xl font-bold text-blue-600">{count}</span></p>
      <div className="space-x-2 mb-2">
        <button 
          onClick={badIncrement}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          ❌ 错误方式（点击可能只+1）
        </button>
        <button 
          onClick={goodIncrement}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          ✅ 正确方式（点击+3）
        </button>
      </div>
      <p className="text-sm text-gray-600">
        说明：快速连续调用 setState 时，使用函数式更新可以确保每次更新都基于最新值
      </p>
    </div>
  )
}

// ==================== 示例 3: 布尔值切换 ====================
const ToggleExample = () => {
  const [isOn, setIsOn] = useState(false)

  return (
    <div className="p-4 border rounded mb-4">
      <h3 className="text-lg font-semibold mb-2">示例3: 开关切换</h3>
      <p className="mb-2">
        状态: <span className={`font-bold ${isOn ? 'text-green-600' : 'text-gray-600'}`}>
          {isOn ? '✅ 开启' : '❌ 关闭'}
        </span>
      </p>
      <div className="space-x-2">
        <button 
          onClick={() => setIsOn(!isOn)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isOn ? '关闭' : '开启'}
        </button>
        {/* 或者使用函数式更新（更推荐） */}
        <button 
          onClick={() => setIsOn(prev => !prev)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          切换
        </button>
      </div>
    </div>
  )
}

// ==================== 示例 4: 文本输入框 ====================


const InputExample = () => {
  const [inputValue, setInputValue] = useState('')
  const [history, setHistory] = useState<string[]>([])

  const handleSubmit = () => {
    if (inputValue.trim()) {
      setHistory(prev => [...prev, inputValue])
      setInputValue('')
    }
  }

  return (
    <div className="p-4 border rounded mb-4">
      <h3 className="text-lg font-semibold mb-2">示例4: 文本输入框</h3>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="输入内容后按回车"
          className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          提交
        </button>
      </div>
      {/* {history.length > 0 && (
        <div className="mt-2">
          <p className="text-sm font-semibold mb-1">输入历史:</p>
          <ul className="list-disc list-inside space-y-1">
            {history.map((item, index) => (
              <li key={index} className="text-sm">{item}</li>
            ))}
          </ul>
        </div>
      )} */}
      {history.length>0&&(
        <div>
            <p>输入历史:</p>
            <ul>
                {history.map((item,index)=>{
                    return (<li className=' mt-[.75rem]' key={index}>{item}</li>)
                })}
            </ul>
        </div>
      )}
    </div>
  )
}

// ==================== 示例 5: 对象状态更新 ====================

const ObjectStateExample = () => {
  const [user, setUser] = useState({
    name: '张三',
    age: 20,
    city: '北京'
  })
//   const [changeName,setChangeName]=useState('')
  const updateName = () => {
    // ✅ 正确：使用展开运算符保留其他属性
    setUser(prev => ({ ...prev, name: '李四' }))
  }

  const updateAge = () => {
    setUser(prev => ({ ...prev, age: prev.age + 1 }))
  }

  const updateCity = () => {
    setUser(prev => ({ ...prev, city: '上海' }))
  }
  const [changeName,setChangeName,resetChangeName]=useInput('')
  return (
    <div className="p-4 border rounded mb-4">
      <h3 className="text-lg font-semibold mb-2">示例5: 对象状态更新</h3>
      <div className="mb-2 space-y-1">
        <p>姓名: <span className="font-semibold">{user.name}</span></p>
        <p>年龄: <span className="font-semibold">{user.age}</span></p>
        <p>城市: <span className="font-semibold">{user.city}</span></p>
      </div>
      <div>
        <input
          type="text"
          {...setChangeName}
        />
        <button onClick={() =>{ setUser(prev => ({ ...prev, name: changeName })),resetChangeName()}}>
          修改名字
        </button>
      </div>
      <div className="space-x-2">
        <button 
          onClick={updateName}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          更新姓名
        </button>
        <button 
          onClick={updateAge}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          增加年龄
        </button>
        <button 
          onClick={updateCity}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          更新城市
        </button>
      </div>
      <p className="text-xs text-gray-600 mt-2">
        注意：更新对象时需要使用展开运算符，避免覆盖其他属性
      </p>
    </div>
  )
}

// ==================== 示例 6: 数组状态操作 ====================
const ArrayStateExample = () => {
  const [items, setItems] = useState(['苹果', '香蕉', '橙子'])

  const addItem = () => {
    const newItem = prompt('输入新项目:')
    if (newItem) {
      // ✅ 正确：创建新数组
      setItems(prev => [...prev, newItem])
    }
  }

  const removeItem = (index: number) => {
    // ✅ 正确：使用 filter 创建新数组
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  const updateItem = (index: number) => {
    const newValue = prompt('输入新值:')
    if (newValue) {
      // ✅ 正确：使用 map 创建新数组
      setItems(prev =>
        prev.map((item, i) => (i === index ? newValue : item))
      )
    }
  }

  return (
    <div className="p-4 border rounded mb-4">
      <h3 className="text-lg font-semibold mb-2">示例6: 数组状态操作</h3>
      <ul className="mb-2 space-y-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="flex-1">{index + 1}. {item}</span>
            <button 
              onClick={() => updateItem(index)}
              className="px-2 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
            >
              修改
            </button>
            <button 
              onClick={() => removeItem(index)}
              className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
            >
              删除
            </button>
          </li>
        ))}
      </ul>
      <button 
        onClick={addItem}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        添加项目
      </button>
    </div>
  )
}

// ==================== 示例 7: 表单管理 ====================
const FormExample = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    rememberMe: false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`表单已提交！\n用户名: ${formData.username}\n密码: ${formData.password}\n邮箱: ${formData.email}\n记住我: ${formData.rememberMe}`)
    console.log('提交的表单数据:', formData)
  }

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      email: '',
      rememberMe: false
    })
  }

  return (
    <div className="p-4 border rounded mb-4">
      <h3 className="text-lg font-semibold mb-2">示例7: 表单管理</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="用户名"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-2">
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="密码"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-2">
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="邮箱"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-2">
          <label className="flex items-center">
            <input
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="mr-2"
            />
            记住我
          </label>
        </div>
        <div className="space-x-2">
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            提交
          </button>
          <button 
            type="button"
            onClick={resetForm}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            重置
          </button>
        </div>
      </form>
    </div>
  )
}

// ==================== 示例 8: 条件渲染 ====================
const ConditionalRenderExample = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')

  const handleLogin = () => {
    const name = prompt('请输入用户名:')
    if (name) {
      setUserName(name)
      setIsLoggedIn(true)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserName('')
  }

  return (
    <div className="p-4 border rounded mb-4">
      <h3 className="text-lg font-semibold mb-2">示例8: 条件渲染</h3>
      {isLoggedIn ? (
        <div>
          <p className="mb-2">欢迎回来, <span className="font-bold text-green-600">{userName}</span>!</p>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            退出登录
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-2">您还未登录</p>
          <button 
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            登录
          </button>
        </div>
      )}
    </div>
  )
}

// ==================== 示例 9: 多个独立状态 ====================
const MultipleStatesExample = () => {
  // ✅ 推荐：按逻辑拆分状态
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')
  const [isActive, setIsActive] = useState(false)

  return (
    <div className="p-4 border rounded mb-4">
      <h3 className="text-lg font-semibold mb-2">示例9: 多个独立状态</h3>
      <div className="mb-2">
        <p>计数: <span className="font-bold text-blue-600">{count}</span></p>
        <button 
          onClick={() => setCount(prev => prev + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          增加
        </button>
      </div>
      <div className="mb-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="输入姓名"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-1">姓名: <span className="font-semibold">{name || '未输入'}</span></p>
      </div>
      <div>
        <p>状态: <span className={`font-bold ${isActive ? 'text-green-600' : 'text-gray-600'}`}>
          {isActive ? '激活' : '未激活'}
        </span></p>
        <button 
          onClick={() => setIsActive(prev => !prev)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          切换状态
        </button>
      </div>
    </div>
  )
}

// ==================== 示例 10: 惰性初始化 ====================
const LazyInitializationExample = () => {
  // ✅ 推荐：只在首次渲染时执行一次
  const [count, setCount] = useState(() => {
    console.log('惰性初始化：只在首次渲染时执行')
    // 假设这里有一个复杂的计算
    return Array.from({ length: 100 }, (_, i) => i).reduce((a, b) => a + b, 0)
  })

  return (
    <div className="p-4 border rounded mb-4">
      <h3 className="text-lg font-semibold mb-2">示例10: 惰性初始化</h3>
      <p>初始值: <span className="font-bold text-blue-600">{count}</span></p>
      <button 
        onClick={() => setCount(prev => prev + 1)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        增加
      </button>
      <p className="text-xs text-gray-600 mt-2">
        查看控制台，惰性初始化函数只执行一次
      </p>
    </div>
  )
}

// ==================== 示例 11: 搜索和过滤 ====================
const SearchFilterExample = () => {
  const products = [
    { id: 1, name: '苹果', category: '水果', price: 10 },
    { id: 2, name: '香蕉', category: '水果', price: 8 },
    { id: 3, name: '胡萝卜', category: '蔬菜', price: 5 },
    { id: 4, name: '西红柿', category: '蔬菜', price: 6 }
  ]

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // 过滤产品
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.includes(searchQuery)
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="p-4 border rounded mb-4">
      <h3 className="text-lg font-semibold mb-2">示例11: 搜索和过滤</h3>
      <div className="mb-2">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索商品..."
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-2">
        <select
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">全部类别</option>
          <option value="水果">水果</option>
          <option value="蔬菜">蔬菜</option>
        </select>
      </div>
      <div className="space-y-1">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="p-2 bg-gray-50 rounded">
              {product.name} - ¥{product.price} ({product.category})
            </div>
          ))
        ) : (
          <p className="text-gray-500">没有找到匹配的商品</p>
        )}
      </div>
    </div>
  )
}

// ==================== 示例 12: 购物车 ====================
interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

const ShoppingCartExample = () => {
  const [cart, setCart] = useState<CartItem[]>([])

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        // 如果已存在，增加数量
        return prev.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      // 如果不存在，添加新项
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const removeItem = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const products = [
    { id: 1, name: '苹果', price: 10 },
    { id: 2, name: '香蕉', price: 8 },
    { id: 3, name: '橙子', price: 12 }
  ]

  return (
    <div className="p-4 border rounded mb-4">
      <h3 className="text-lg font-semibold mb-2">示例12: 购物车</h3>
      <div className="mb-4">
        <h4 className="font-semibold mb-2">商品列表:</h4>
        <div className="space-y-2">
          {products.map(product => (
            <div key={product.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <span className="flex-1">{product.name} - ¥{product.price}</span>
              <button 
                onClick={() => addItem(product)}
                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
              >
                加入购物车
              </button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-2">购物车:</h4>
        {cart.length === 0 ? (
          <p className="text-gray-500">购物车为空</p>
        ) : (
          <>
            <div className="space-y-2 mb-2">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="flex-1">{item.name}</span>
                  <span>¥{item.price}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                  >
                    -
                  </button>
                  <span className="font-semibold">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-2 p-2 bg-blue-50 rounded">
              <span className="font-bold text-lg">总价: ¥{total}</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ==================== 主组件：展示所有示例 ====================
export default function UseStateExamples() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">useState 实战示例集合</h1>
        <p className="text-gray-600">
          以下是 useState Hook 的各种用法示例，每个示例都可以独立运行和测试
        </p>
      </div>
      
      <BasicCounter />
      <FunctionalUpdateCounter />
      <ToggleExample />
      <InputExample />
      <ObjectStateExample />
      <ArrayStateExample />
      <FormExample />
      <ConditionalRenderExample />
      <MultipleStatesExample />
      <LazyInitializationExample />
      <SearchFilterExample />
      <ShoppingCartExample />

      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold mb-2">💡 学习建议</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>尝试修改每个示例中的状态值，观察 UI 如何更新</li>
          <li>打开浏览器控制台，查看示例 10 的惰性初始化日志</li>
          <li>在示例 2 中快速点击按钮，观察函数式更新和直接更新的区别</li>
          <li>理解对象和数组状态更新时需要使用不可变操作</li>
        </ul>
      </div>
    </div>
  )
}


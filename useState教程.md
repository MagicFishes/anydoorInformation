# React useState 完整教程

## 📚 目录
1. [基础概念](#基础概念)
2. [基本用法](#基本用法)
3. [设置初始值](#设置初始值)
4. [更新状态的方法](#更新状态的方法)
5. [函数式更新](#函数式更新)
6. [对象和数组状态](#对象和数组状态)
7. [常见陷阱和错误](#常见陷阱和错误)
8. [最佳实践](#最佳实践)
9. [性能优化技巧](#性能优化技巧)
10. [实际应用示例](#实际应用示例)

---

## 基础概念

### 什么是 useState？

`useState` 是 React 的一个 Hook，用于在函数组件中添加状态管理功能。

**核心特点：**
- ✅ 只能在函数组件中使用
- ✅ 只能在组件顶层调用（不能在条件语句、循环中调用）
- ✅ 每次组件重新渲染时，useState 返回的状态值是最新的
- ✅ 状态更新会触发组件重新渲染

### 基本语法

```typescript
const [state, setState] = useState(initialValue)
```

**参数说明：**
- `initialValue`: 状态的初始值（可以是任何类型）
- 返回值：数组，包含两个元素
  - `state`: 当前状态值
  - `setState`: 用于更新状态的函数

---

## 基本用法

### 示例 1：简单计数器

```typescript
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0) // 初始值为 0

  return (
    <div>
      <p>当前计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
      <button onClick={() => setCount(count - 1)}>减少</button>
      <button onClick={() => setCount(0)}>重置</button>
    </div>
  )
}
```

### 示例 2：文本输入框

```typescript
function InputExample() {
  const [inputValue, setInputValue] = useState('')

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="请输入内容"
      />
      <p>您输入的内容: {inputValue}</p>
    </div>
  )
}
```

### 示例 3：布尔值切换

```typescript
function ToggleExample() {
  const [isOn, setIsOn] = useState(false)

  return (
    <div>
      <p>开关状态: {isOn ? '开启' : '关闭'}</p>
      <button onClick={() => setIsOn(!isOn)}>
        {isOn ? '关闭' : '开启'}
      </button>
      {/* 或者使用函数式更新 */}
      <button onClick={() => setIsOn(prev => !prev)}>
        切换
      </button>
    </div>
  )
}
```

---

## 设置初始值

### 1. 直接值（立即计算）

```typescript
// ✅ 简单值
const [count, setCount] = useState(0)
const [name, setName] = useState('张三')
const [isActive, setIsActive] = useState(false)

// ✅ 对象
const [user, setUser] = useState({ name: '张三', age: 20 })

// ✅ 数组
const [items, setItems] = useState([1, 2, 3])
```

### 2. 延迟初始化（惰性初始化）

**使用场景：** 初始值需要复杂计算时

```typescript
// ❌ 不推荐：每次渲染都会执行 expensiveFunction()
const [data, setData] = useState(expensiveFunction())

// ✅ 推荐：只在首次渲染时执行一次
const [data, setData] = useState(() => expensiveFunction())
```

**实际例子：**

```typescript
function ExpensiveCounter() {
  // 假设这个计算很耗时
  const expensiveInitialValue = () => {
    console.log('计算初始值...')
    return Array.from({ length: 1000 }, (_, i) => i).reduce((a, b) => a + b, 0)
  }

  // ❌ 错误：每次渲染都会重新计算
  const [count, setCount] = useState(expensiveInitialValue())

  // ✅ 正确：只在首次渲染时计算一次
  const [count2, setCount2] = useState(() => {
    console.log('只计算一次')
    return expensiveInitialValue()
  })

  return <div>{count2}</div>
}
```

### 3. 从 props 初始化

```typescript
interface CounterProps {
  initialCount: number
}

function Counter({ initialCount }: CounterProps) {
  // ✅ 直接从 props 初始化
  const [count, setCount] = useState(initialCount)

  // ⚠️ 注意：如果 props 变化，state 不会自动更新！
  // 如果需要同步 props，使用 useEffect
  useEffect(() => {
    setCount(initialCount)
  }, [initialCount])

  return <div>{count}</div>
}
```

---

## 更新状态的方法

### 方法 1：直接值更新

```typescript
const [count, setCount] = useState(0)

// 直接传递新值
setCount(5)        // count 变为 5
setCount(10)       // count 变为 10
setCount('hello')  // ❌ 类型错误！TypeScript 会报错
```

### 方法 2：函数式更新（推荐）

```typescript
const [count, setCount] = useState(0)

// 函数式更新：基于前一个状态值
setCount(prevCount => prevCount + 1)
setCount(prevCount => prevCount * 2)
setCount(prevCount => prevCount - 1)
```

**什么时候使用函数式更新？**

1. **多次快速更新时**
```typescript
// ❌ 问题：三次 setCount 可能都基于同一个 count 值
const handleClick = () => {
  setCount(count + 1)
  setCount(count + 1)
  setCount(count + 1)
  // 结果：count 只增加 1（不是 3）
}

// ✅ 解决：使用函数式更新
const handleClick = () => {
  setCount(prev => prev + 1)
  setCount(prev => prev + 1)
  setCount(prev => prev + 1)
  // 结果：count 增加 3
}
```

2. **异步操作后更新**
```typescript
const [count, setCount] = useState(0)

useEffect(() => {
  setTimeout(() => {
    // ❌ 可能获取到旧值
    setCount(count + 1)
    
    // ✅ 总是获取最新值
    setCount(prev => prev + 1)
  }, 1000)
}, [])
```

3. **状态依赖前一个状态时**
```typescript
// 切换布尔值
setIsActive(prev => !prev)

// 计数器
setCount(prev => prev + 1)
```

---

## 对象和数组状态

### 更新对象状态

React 状态更新是**浅合并**的，需要手动合并对象。

```typescript
const [user, setUser] = useState({ name: '张三', age: 20, city: '北京' })

// ❌ 错误：会丢失其他属性
setUser({ name: '李四' }) // { name: '李四' } - age 和 city 丢失了！

// ✅ 正确：使用展开运算符保留其他属性
setUser({ ...user, name: '李四' }) // { name: '李四', age: 20, city: '北京' }

// ✅ 更推荐：使用函数式更新
setUser(prev => ({ ...prev, name: '李四' }))
setUser(prev => ({ ...prev, age: 21 }))
setUser(prev => ({ ...prev, city: '上海', age: 22 }))
```

### 更新数组状态

```typescript
const [items, setItems] = useState([1, 2, 3])

// ❌ 错误：直接修改数组（React 不会检测到变化）
items.push(4) // 不会触发重新渲染！

// ✅ 正确：创建新数组
// 添加元素
setItems([...items, 4])
setItems([...items, 5, 6])

// 删除元素
setItems(items.filter(item => item !== 2))

// 更新元素
setItems(items.map(item => item === 2 ? 99 : item))

// ✅ 使用函数式更新（推荐）
setItems(prev => [...prev, 4])
setItems(prev => prev.filter(item => item !== 2))
setItems(prev => prev.map(item => item === 2 ? 99 : item))
```

### 嵌套对象和数组更新

```typescript
const [state, setState] = useState({
  user: {
    name: '张三',
    profile: {
      age: 20,
      hobbies: ['读书', '游泳']
    }
  },
  items: [1, 2, 3]
})

// 更新嵌套对象
setState(prev => ({
  ...prev,
  user: {
    ...prev.user,
    profile: {
      ...prev.user.profile,
      age: 21
    }
  }
}))

// 更新嵌套数组
setState(prev => ({
  ...prev,
  user: {
    ...prev.user,
    profile: {
      ...prev.user.profile,
      hobbies: [...prev.user.profile.hobbies, '编程']
    }
  }
}))

// 或者使用 Immer 库简化深层更新（推荐）
import { useImmer } from 'use-immer'

const [state, updateState] = useImmer({...})
updateState(draft => {
  draft.user.profile.age = 21
  draft.user.profile.hobbies.push('编程')
})
```

---

## 常见陷阱和错误

### ❌ 错误 1：在条件语句中使用 Hook

```typescript
function Component() {
  if (true) {
    const [count, setCount] = useState(0) // ❌ 错误！
  }
  // Hook 必须在组件顶层调用
}
```

**正确做法：**
```typescript
function Component() {
  const [count, setCount] = useState(0) // ✅ 正确
  
  if (true) {
    // 可以在这里使用 count
  }
}
```

### ❌ 错误 2：直接修改状态

```typescript
const [user, setUser] = useState({ name: '张三', age: 20 })

// ❌ 错误：直接修改不会触发重新渲染
user.name = '李四'

// ✅ 正确：创建新对象
setUser({ ...user, name: '李四' })
```

### ❌ 错误 3：异步更新状态后立即读取

```typescript
const [count, setCount] = useState(0)

const handleClick = () => {
  setCount(count + 1)
  console.log(count) // ❌ 输出的是旧值，不是更新后的值！
}

// 原因：setState 是异步的，不会立即更新
// 如果需要在更新后执行操作，使用 useEffect
useEffect(() => {
  console.log('count 更新了:', count)
}, [count])
```

### ❌ 错误 4：状态更新依赖旧状态时未使用函数式更新

```typescript
const [count, setCount] = useState(0)

// ❌ 问题：在快速点击时可能丢失更新
const handleClick = () => {
  setCount(count + 1)
}

// ✅ 解决：使用函数式更新
const handleClick = () => {
  setCount(prev => prev + 1)
}
```

### ❌ 错误 5：在循环或回调中创建多个状态

```typescript
function Component() {
  const items = [1, 2, 3]
  
  // ❌ 错误：不能在循环中调用 Hook
  items.forEach(item => {
    const [state, setState] = useState(item) // 错误！
  })
  
  // ✅ 正确：使用单个数组状态
  const [items, setItems] = useState([1, 2, 3])
}
```

---

## 最佳实践

### 1. 状态拆分原则

**不要把所有状态放在一个对象里：**

```typescript
// ❌ 不推荐：所有状态塞在一起
const [state, setState] = useState({
  count: 0,
  name: '',
  isActive: false,
  items: []
})

// ✅ 推荐：按逻辑拆分
const [count, setCount] = useState(0)
const [name, setName] = useState('')
const [isActive, setIsActive] = useState(false)
const [items, setItems] = useState([])

// 例外：如果这些状态总是同时更新，可以合并
const [form, setForm] = useState({
  username: '',
  password: '',
  email: ''
})
```

### 2. 使用 TypeScript 类型

```typescript
// 定义类型
interface User {
  name: string
  age: number
  email?: string
}

// 使用类型
const [user, setUser] = useState<User>({
  name: '张三',
  age: 20
})

// 或者使用类型推断
const [user, setUser] = useState<User | null>(null)
```

### 3. 状态初始化最佳实践

```typescript
// ✅ 简单值直接初始化
const [count, setCount] = useState(0)

// ✅ 复杂计算使用惰性初始化
const [data, setData] = useState(() => {
  return expensiveCalculation()
})

// ✅ 对象状态
const [user, setUser] = useState<User | null>(null)
// 或者提供默认值
const [user, setUser] = useState<User>({
  name: '',
  age: 0
})
```

### 4. 状态更新模式

```typescript
// ✅ 简单更新：直接值
setCount(5)

// ✅ 依赖前值：函数式更新
setCount(prev => prev + 1)

// ✅ 对象更新：展开运算符
setUser(prev => ({ ...prev, name: '新名字' }))

// ✅ 数组更新：不可变操作
setItems(prev => [...prev, newItem])
setItems(prev => prev.filter(item => item.id !== id))
```

### 5. 状态提升

**当多个组件需要共享状态时，提升到共同的父组件：**

```typescript
// 父组件
function Parent() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <Child1 count={count} />
      <Child2 setCount={setCount} />
    </div>
  )
}

// 子组件 1：显示状态
function Child1({ count }: { count: number }) {
  return <div>计数: {count}</div>
}

// 子组件 2：修改状态
function Child2({ setCount }: { setCount: (n: number) => void }) {
  return <button onClick={() => setCount(prev => prev + 1)}>增加</button>
}
```

---

## 性能优化技巧

### 1. 避免不必要的重新渲染

```typescript
// ❌ 问题：每次渲染都创建新对象/数组
function Component() {
  const [count, setCount] = useState(0)
  
  return <Child value={{ count }} /> // 每次都是新对象！
}

// ✅ 解决：使用 useMemo
function Component() {
  const [count, setCount] = useState(0)
  const value = useMemo(() => ({ count }), [count])
  
  return <Child value={value} />
}
```

### 2. 状态更新批处理

React 18+ 会自动批处理多个状态更新：

```typescript
function Component() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')
  
  const handleClick = () => {
    setCount(1)
    setName('张三')
    // React 18+ 会自动批处理，只渲染一次
    // React 17 及以下可能渲染两次
  }
}
```

### 3. 使用 useCallback 优化更新函数

```typescript
const [count, setCount] = useState(0)

// ❌ 每次渲染都创建新函数
const increment = () => setCount(count + 1)

// ✅ 使用 useCallback 或函数式更新
const increment = useCallback(() => {
  setCount(prev => prev + 1)
}, [])
```

### 4. 大列表优化

```typescript
// 使用虚拟滚动或分页
const [items, setItems] = useState<Item[]>([])
const [page, setPage] = useState(1)

// 只渲染可见项
const visibleItems = useMemo(() => {
  return items.slice((page - 1) * 10, page * 10)
}, [items, page])
```

---

## 实际应用示例

### 示例 1：表单管理

```typescript
function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
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
    console.log('提交表单:', formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="用户名"
      />
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="密码"
      />
      <label>
        <input
          name="rememberMe"
          type="checkbox"
          checked={formData.rememberMe}
          onChange={handleChange}
        />
        记住我
      </label>
      <button type="submit">登录</button>
    </form>
  )
}
```

### 示例 2：购物车

```typescript
interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

function ShoppingCart() {
  const [cart, setCart] = useState<CartItem[]>([])

  // 添加商品
  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  // 更新数量
  const updateQuantity = (id: number, quantity: number) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  // 删除商品
  const removeItem = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  // 计算总价
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div>
      {cart.map(item => (
        <div key={item.id}>
          <span>{item.name}</span>
          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
            -
          </button>
          <span>{item.quantity}</span>
          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
            +
          </button>
          <button onClick={() => removeItem(item.id)}>删除</button>
        </div>
      ))}
      <div>总价: ¥{total}</div>
    </div>
  )
}
```

### 示例 3：搜索和过滤

```typescript
function ProductList() {
  const [products, setProducts] = useState([
    { id: 1, name: '苹果', category: '水果', price: 10 },
    { id: 2, name: '香蕉', category: '水果', price: 8 },
    { id: 3, name: '胡萝卜', category: '蔬菜', price: 5 }
  ])
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // 过滤产品
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.includes(searchQuery)
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="搜索商品..."
      />
      <select
        value={selectedCategory || ''}
        onChange={(e) => setSelectedCategory(e.target.value || null)}
      >
        <option value="">全部类别</option>
        <option value="水果">水果</option>
        <option value="蔬菜">蔬菜</option>
      </select>
      
      <div>
        {filteredProducts.map(product => (
          <div key={product.id}>{product.name} - ¥{product.price}</div>
        ))}
      </div>
    </div>
  )
}
```

---

## 📝 总结

### 核心要点

1. ✅ `useState` 是 React Hook，用于函数组件状态管理
2. ✅ 必须在组件顶层调用，不能在条件语句中使用
3. ✅ 状态更新是异步的，不会立即生效
4. ✅ 更新状态时使用不可变操作（创建新对象/数组）
5. ✅ 依赖前一个状态时，使用函数式更新
6. ✅ 复杂初始值使用惰性初始化函数

### 常用模式

```typescript
// 基础模式
const [state, setState] = useState(initialValue)

// 更新模式
setState(newValue)                    // 直接值
setState(prev => newValue)            // 函数式更新
setState(prev => ({ ...prev, ... }))  // 对象更新
setState(prev => [...prev, item])     // 数组添加
setState(prev => prev.filter(...))    // 数组删除
```

### 下一步学习

掌握 `useState` 后，可以继续学习：
- `useEffect` - 处理副作用
- `useCallback` / `useMemo` - 性能优化
- `useReducer` - 复杂状态管理
- `useContext` - 跨组件状态共享

---

## 🎯 练习建议

1. 实现一个待办事项应用（增删改查）
2. 创建一个表单组件（多个输入框）
3. 实现一个购物车功能
4. 做一个搜索过滤组件

祝你学习愉快！🚀


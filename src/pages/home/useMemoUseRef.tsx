import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
  memo
} from 'react'

type Product = {
  id: number
  name: string
  category: '图书' | '课程' | '工具'
  price: number
}

const products: Product[] = [
  { id: 1, name: 'React 深入浅出', category: '图书', price: 59 },
  { id: 2, name: 'TypeScript 进阶', category: '课程', price: 249 },
  { id: 3, name: '性能调优实战', category: '课程', price: 299 },
  { id: 4, name: 'VSCode 插件合集', category: '工具', price: 99 },
  { id: 5, name: 'React Hooks 指南', category: '图书', price: 79 },
  { id: 6, name: '前端工程化', category: '课程', price: 199 }
]

type ProductListProps = {
  items: Product[]
  onPick: (id: number) => void
  activeId: number | null
}

const ProductList = memo(({ items, onPick, activeId }: ProductListProps) => {
  console.log('ProductList 渲染')
  return (
    <ul style={{ lineHeight: 1.6 }}>
      {items.map((item) => (
        <li
          key={item.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            marginBottom: 6,
            borderRadius: 8,
            border: '1px solid #d9d9d9',
            background: activeId === item.id ? '#e6f7ff' : '#fff'
          }}
        >
          <div>
            <div style={{ fontWeight: 600 }}>{item.name}</div>
            <small style={{ color: '#666' }}>
              {item.category} · ¥{item.price}
            </small>
          </div>
          <button onClick={() => onPick(item.id)}>加入关注</button>
        </li>
      ))}
      {items.length === 0 && <li>未找到匹配数据</li>}
    </ul>
  )
})

const UseMemoUseRefDemo: React.FC = () => {
  const [keyword, setKeyword] = useState('')
  const [minPrice, setMinPrice] = useState(0)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  // 记录组件渲染的次数（不会触发重渲染）
  const renderCountRef = useRef(0)
  // 保存上一次筛选条件
  const lastFilterRef = useRef<{ keyword: string; minPrice: number }>({
    keyword: '',
    minPrice: 0
  })
  // 缓存最近一次选中的商品详情
  const selectedProductRef = useRef<Product | null>(null)
  // 引用输入框 DOM，支持聚焦
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    renderCountRef.current += 1
  })

  useEffect(() => {
    lastFilterRef.current = { keyword, minPrice }
  }, [keyword, minPrice])

  const filteredProducts = useMemo(() => {
    console.log('执行昂贵过滤逻辑')
    const normalizedKeyword = keyword.trim().toLowerCase()
    // 模拟昂贵计算
    const expensiveWork: number = Array.from({ length: 50000 }).reduce(
      (acc: number, _, index: number) => acc + Math.sin(index),
      0
    );
    console.log('模拟耗时计算: ', expensiveWork.toFixed(2));
    return products.filter((product) => {
      const matchKeyword =
        normalizedKeyword.length === 0 ||
        product.name.toLowerCase().includes(normalizedKeyword)
      const matchPrice = product.price >= minPrice
      return matchKeyword && matchPrice
    })
  }, [keyword, minPrice])

  const totalPrice = useMemo(() => {
    console.log('统计总价')
    return filteredProducts.reduce((sum, item) => sum + item.price, 0)
  }, [filteredProducts])

  const handlePick = useCallback(
    (id: number) => {
      setSelectedId(id)
      selectedProductRef.current = filteredProducts.find((item) => item.id === id) || null
    },
    [filteredProducts]
  )

  const resetFilter = useCallback(() => {
    setKeyword('')
    setMinPrice(0)
    inputRef.current?.focus()
  }, [])

  const escapeRegExp = useCallback((value: string) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }, [])

  const highlightKeywords = useMemo(() => {
    if (!keyword) {
      return filteredProducts
    }
    const normalizedKeyword = keyword.trim()
    const safeKeyword = escapeRegExp(normalizedKeyword)
    return filteredProducts.map((item) => ({
      ...item,
      name: item.name.replace(
        new RegExp(`(${safeKeyword})`, 'ig'),
        (match) => `【${match}】`
      )
    }))
  }, [escapeRegExp, filteredProducts, keyword])

  return (
    <div style={{ padding: 24 }}>
      <h2>useMemo / useRef：性能优化与引用管理</h2>

      <section style={{ marginBottom: 24 }}>
        <h3>筛选条件</h3>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <label>
            关键词：
            <input
              ref={inputRef}
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="输入商品名关键字"
            />
          </label>
          <label>
            最低价格：
            <input
              type="number"
              value={minPrice}
              onChange={(event) => setMinPrice(Number(event.target.value) || 0)}
              style={{ width: 80 }}
            />
          </label>
          <button onClick={resetFilter}>重置条件并聚焦</button>
        </div>
        <p style={{ color: '#999', marginTop: 8 }}>
          上次筛选条件：{lastFilterRef.current.keyword || '（空）'} / ¥
          {lastFilterRef.current.minPrice}
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3>筛选结果（useMemo 缓存）</h3>
        <p>匹配数量：{filteredProducts.length} 个 · 总价：¥{totalPrice}</p>
        <ProductList items={highlightKeywords} onPick={handlePick} activeId={selectedId} />
      </section>

      <section>
        <h3>useRef 保存不可见状态</h3>
        <p>组件渲染次数：{renderCountRef.current}</p>
        <p>
          最近关注商品：
          {selectedProductRef.current
            ? `${selectedProductRef.current.name}（¥${selectedProductRef.current.price}）`
            : '暂无'}
        </p>
        <p>
          说明：上述信息保存在 useRef 中，更新后不会触发重渲染，但在下一次渲染时依旧可读，适合缓存副作用状态。
        </p>
      </section>
    </div>
  )
}

export default UseMemoUseRefDemo


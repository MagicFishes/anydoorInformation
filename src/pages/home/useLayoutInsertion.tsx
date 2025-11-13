import React, {
  useEffect,
  useInsertionEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react'

type PaletteKey = 'sky' | 'amber' | 'violet'

const layoutBoxBaseStyle: React.CSSProperties = {
  borderRadius: 12,
  background:
    'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(14,116,144,0.12) 100%)',
  border: '1px solid rgba(59,130,246,0.25)',
  padding: '16px 20px',
  lineHeight: 1.6,
  transition: 'height 320ms ease, padding 320ms ease'
}

const LayoutEffectDemo: React.FC = () => {
  const [expanded, setExpanded] = useState(false)

  const layoutRef = useRef<HTMLDivElement | null>(null)
  const effectRef = useRef<HTMLDivElement | null>(null)

  const [layoutHeight, setLayoutHeight] = useState(0)
  const [effectHeight, setEffectHeight] = useState(0)
  const [layoutLogs, setLayoutLogs] = useState<string[]>([])
  const [effectLogs, setEffectLogs] = useState<string[]>([])

  useLayoutEffect(() => {
    const current = layoutRef.current
    if (!current) {
      return
    }
    const rect = current.getBoundingClientRect()
    const height = Math.round(rect.height)
    setLayoutHeight(height)
    setLayoutLogs((prev) => [`同步测量高度：${height}px`, ...prev].slice(0, 4))
  }, [expanded])

  useEffect(() => {
    const current = effectRef.current
    if (!current) {
      return
    }
    const rect = current.getBoundingClientRect()
    const height = Math.round(rect.height)
    setEffectHeight(height)
    setEffectLogs((prev) => [`绘制后测量高度：${height}px`, ...prev].slice(0, 4))
  }, [expanded])

  const detailContent = useMemo(
    () => (
      <ul className="mt-3 list-disc pl-5 text-sm text-slate-600">
        <li>当前时间戳：{new Date().toLocaleTimeString()}</li>
        <li>展开状态：{expanded ? '展开' : '收起'}</li>
        <li>附加说明：这里模拟需要同步读写布局的场景。</li>
      </ul>
    ),
    [expanded]
  )

  return (
    <section>
      <h3 className="text-xl font-semibold text-slate-800">useLayoutEffect：绘制前同步完成布局操作</h3>
      <p className="text-slate-600">
        当我们读取或同步写入布局信息时，使用 useLayoutEffect 可以确保浏览器在绘制前就完成副作用，避免闪烁。
      </p>

      <div className="mt-5 flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <header className="flex items-center justify-between">
            <strong className="text-slate-800">useLayoutEffect 测量</strong>
            <span className="text-xs text-slate-500">高度：{layoutHeight}px</span>
          </header>
          <div ref={layoutRef} style={layoutBoxBaseStyle}>
            <p>渲染输出会在布局测量后再呈现，不会看到高度为 0 的瞬间。</p>
            {expanded && (
              <p className="mt-3">
                额外内容：useLayoutEffect 在 DOM 更新提交后、浏览器绘制前执行，
                我们可以在这里安全地读取布局并同步更新状态。
              </p>
            )}
            {detailContent}
          </div>
          <ul className="mt-4 space-y-2 text-xs text-emerald-600">
            {layoutLogs.length === 0 && <li>等待交互以观察执行顺序</li>}
            {layoutLogs.map((log, index) => (
              <li key={index}>✅ {log}</li>
            ))}
          </ul>
        </div>

        <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <header className="flex items-center justify-between">
            <strong className="text-slate-800">useEffect 测量</strong>
            <span className="text-xs text-slate-500">高度：{effectHeight}px</span>
          </header>
          <div
            ref={effectRef}
            style={{
              ...layoutBoxBaseStyle,
              border: '1px solid rgba(248,113,113,0.35)',
              background:
                'linear-gradient(135deg, rgba(248,113,113,0.12) 0%, rgba(251,191,36,0.12) 100%)'
            }}
          >
            <p>首次渲染会先看到默认高度，绘制后 useEffect 才能拿到真实尺寸。</p>
            {expanded && (
              <p className="mt-3">
                如果在这里立即读取布局，会滞后一个浏览器帧。复杂布局下可能造成闪烁或错位。
              </p>
            )}
            {detailContent}
          </div>
          <ul className="mt-4 space-y-2 text-xs text-rose-600">
            {effectLogs.length === 0 && <li>等待交互以观察执行顺序</li>}
            {effectLogs.map((log, index) => (
              <li key={index}>⚠️ {log}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-white shadow transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? '收起额外内容' : '展开额外内容'}
        </button>
        <button
          className="rounded-md bg-slate-100 px-4 py-2 text-slate-700 shadow transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-1"
          onClick={() => {
            setExpanded(false)
            setLayoutLogs([])
            setEffectLogs([])
          }}
        >
          重置状态
        </button>
      </div>
    </section>
  )
}

const palette: Record<PaletteKey, { label: string; accent: string }> = {
  sky: { label: '天蓝', accent: '#38bdf8' },
  amber: { label: '琥珀', accent: '#f59e0b' },
  violet: { label: '紫罗兰', accent: '#8b5cf6' }
}

const useDynamicToken = (key: PaletteKey) => {
  const color = palette[key]?.accent

  useInsertionEffect(() => {
    if (typeof document === 'undefined') {
      return undefined
    }

    const styleTag = document.createElement('style')
    styleTag.setAttribute('data-demo-style', `insertion-${key}`)
    styleTag.textContent = `
      .insertion-demo[data-color="${key}"]::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 1rem;
        z-index: -1;
        background: linear-gradient(135deg, ${color}16 0%, ${color}33 100%);
        border: 1px solid ${color}55;
        box-shadow: 0 10px 30px ${color}22;
      }
    `

    document.head.appendChild(styleTag)

    return () => {
      document.head.removeChild(styleTag)
    }
  }, [key, color])
}

const InsertionEffectDemo: React.FC = () => {
  const [current, setCurrent] = useState<PaletteKey>('sky')
  useDynamicToken(current)

  const explainList = useMemo(
    () => [
      'useInsertionEffect 在 React 注入样式前执行，适合 CSS-in-JS 库。',
      '副作用必须同步完成，避免在此发起异步请求或操作布局。',
      '如果在 useEffect 中注入样式，首帧可能闪烁或出现无样式状态。'
    ],
    []
  )

  return (
    <section>
      <h3 className="text-xl font-semibold text-slate-800">useInsertionEffect：样式注入前优先执行</h3>
      <p className="text-slate-600">
        在 React 将样式写入 DOM 之前运行，常用于样式库提前插入动态样式，确保样式顺序正确且无闪烁。
      </p>

      <div
        className="insertion-demo relative mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all"
        data-color={current}
      >
        <header className="flex flex-wrap items-center gap-3">
          <strong className="text-lg text-slate-800">动态主题示例</strong>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
            当前主题 · {palette[current].label}
          </span>
        </header>

        <p className="mt-4 text-slate-600">
          点击下方按钮切换主题色，useInsertionEffect 会在样式插入之前完成样式表更新，避免出现“无样式”闪烁。
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {(Object.keys(palette) as PaletteKey[]).map((key) => (
            <button
              key={key}
              className={`rounded-md px-4 py-2 text-sm font-medium shadow transition focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                key === current
                  ? 'bg-slate-900 text-white focus:ring-slate-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-300'
              }`}
              onClick={() => setCurrent(key)}
            >
              {palette[key].label}
            </button>
          ))}
        </div>

        <ul className="mt-6 space-y-2 text-sm text-slate-600">
          {explainList.map((item, index) => (
            <li key={index}>• {item}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const UseLayoutInsertionPage: React.FC = () => (
  <div className="page use-layout-insertion-page p-[5rem]">
    <header className="mb-10 space-y-3">
      <h2 className="text-3xl font-bold text-slate-900">useLayoutEffect &amp; useInsertionEffect 对比</h2>
      <p className="max-w-3xl text-slate-600">
        两个 Hook 都属于副作用控制工具，但执行时机不同：useLayoutEffect 用于绘制前同步访问布局，
        useInsertionEffect 则用于在 React 写入样式之前完成样式注入。下面通过示例演示各自的最佳场景。
      </p>
    </header>

    <main className="demo-grid space-y-16">
      <LayoutEffectDemo />
      <InsertionEffectDemo />
    </main>
  </div>
)

export default UseLayoutInsertionPage

import { type ChangeEvent, type ReactNode, useRef, useState } from 'react'
// 未学 useContext，useDebugValue，useDeferredValue，useEffectEvent，useId
// useImperativeHandle，useInsertionEffect，useLayoutEffect
// useOptimistic，useReducer，useSyncExternalStore，useTransition
type FormDemoState = {
  username: string
  email: string
  age: string
  subscribe: boolean
  gender: string
  country: string
  colors: string[]
  skills: string[]
  interests: string[]
  contactPref: string
  bio: string
}

const formDemoInitialState: FormDemoState = {
  username: '',
  email: '',
  age: '',
  subscribe: false,
  gender: 'female',
  country: 'china',
  colors: [],
  skills: [],
  interests: [],
  contactPref: 'email',
  bio: '',
}

type SectionCardProps = {
  id?: string
  title: string
  description?: string
  children: ReactNode
}

function SectionCard({ id, title, description, children }: SectionCardProps) {
  return (
    <section
      id={id}
      className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur"
    >
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {description ? <p className="text-sm text-slate-300">{description}</p> : null}
      </header>
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  )
}

export default function Home() {
  const checkboxRef = useRef<HTMLInputElement>(null)
  const [agree, setAgree] = useState(false)
  const [color, setColor] = useState('red')
  const [hobbies, setHobbies] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [price, setPrice] = useState<number>(0)
  const [meetingDate, setMeetingDate] = useState('')
  const [satisfaction, setSatisfaction] = useState(5)
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('china')
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [sizeSelection, setSizeSelection] = useState('2')
  const [bio, setBio] = useState('')
  const [feedback, setFeedback] = useState('')
  const [hardWrap, setHardWrap] = useState('请输入内容，每行会被记录')
  const [favoriteCity, setFavoriteCity] = useState('shanghai')
  const [formDemo, setFormDemo] = useState<FormDemoState>(formDemoInitialState)

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAgree(e.target.checked)
    console.log('checkbox:', e.target.checked)
    console.dir(e.target)
  }

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value)
    console.log('radio:', e.target.value)
    console.dir(e.target)
  }

  const handleMultiCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target
    console.log('value:', value, 'checked:', checked)
    setHobbies(prev => {
      if (checked) {
        return prev.includes(value) ? prev : [...prev, value]
      }
      return prev.filter(item => item !== value)
    })

    // console.log("multi checkbox:", value, checked);
    console.dir(e.target)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    setSelectedFiles(files)
    console.log('files:', files)
  }

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number.parseFloat(e.target.value)
    setPrice(Number.isNaN(nextValue) ? 0 : nextValue)
    console.log('price:', nextValue)
    console.dir(e.target)
  }

  const handleMeetingDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMeetingDate(e.target.value)
    console.log('meetingDate:', e.target.value)
    console.dir(e.target)
  }

  const handleRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number.parseInt(e.target.value, 10)
    setSatisfaction(nextValue)
    console.log('satisfaction:', nextValue)
    console.dir(e.target)
  }

  const handleCityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value)
    console.log('city:', e.target.value)
    console.dir(e.target)
  }

  const handleCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCountry(e.target.value)
    console.log('country:', e.target.value)
    console.dir(e.target)
  }

  const handleSelectedCountriesChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, option => option.value)
    setSelectedCountries(values)
    console.log('selected countries:', values)
    console.dir(e.target)
  }

  const handleSizeSelectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSizeSelection(e.target.value)
    console.log('size selection:', e.target.value)
    console.dir(e.target)
  }

  const handleFavoriteCityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFavoriteCity(e.target.value)
    console.log('favorite city:', e.target.value)
    console.dir(e.target)
  }

  const handleFormDemoChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, type } = e.target

    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement
      const currentValue = formDemo[name as keyof FormDemoState]

      if (Array.isArray(currentValue)) {
        setFormDemo(prev => {
          const prevArray = prev[name as keyof FormDemoState] as string[]
          const nextArray = target.checked
            ? prevArray.includes(target.value)
              ? prevArray
              : [...prevArray, target.value]
            : prevArray.filter(item => item !== target.value)

          return {
            ...prev,
            [name]: nextArray,
          }
        })
      } else {
        setFormDemo(prev => ({
          ...prev,
          [name]: target.checked,
        }))
      }
    } else if (type === 'radio') {
      const target = e.target as HTMLInputElement
      if (target.checked) {
        setFormDemo(prev => ({
          ...prev,
          [name]: target.value,
        }))
      }
    } else if (type === 'select-multiple') {
      const target = e.target as HTMLSelectElement
      const values = Array.from(target.selectedOptions, option => option.value)
      setFormDemo(prev => ({
        ...prev,
        [name]: values,
      }))
    } else {
      setFormDemo(prev => ({
        ...prev,
        [name]: e.target.value,
      }))
    }
  }

  const handleFormDemoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('统一表单提交', formDemo)
    alert(`统一表单提交：\n${JSON.stringify(formDemo, null, 2)}`)
  }

  const handleFormDemoReset = () => {
    setFormDemo(() => ({ ...formDemoInitialState }))
  }

  const handleBioChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value)
    console.log('bio:', e.target.value)
    console.dir(e.target)
  }

  const handleFeedbackChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.target.value)
    console.log('feedback:', e.target.value)
    console.dir(e.target)
  }

  const handleHardWrapChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setHardWrap(e.target.value)
    console.log('hardWrap:', e.target.value)
    console.dir(e.target)
  }

  const [password, setPassword] = useState('')
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    console.log('password:', e.target.value)
    console.dir(e.target)
  }
  const [search, setSearch] = useState('')
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    console.log('search:', e.target.value)
    console.dir(e.target)
  }
  const [tel, setTel] = useState('')
  const handleTelChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTel(e.target.value)
    console.log('tel:', e.target.value)
    console.dir(e.target)
  }
  const [url, setUrl] = useState('')
  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
    console.log('url:', e.target.value)
    console.dir(e.target)
  }
  const [datetimeLocal, setDatetimeLocal] = useState('')
  const [hiddenToken] = useState('hidden-value')
  const [mathA, setMathA] = useState(10)
  const [mathB, setMathB] = useState(20)
  const [taskProgress, setTaskProgress] = useState(40)
  const [systemLoad, setSystemLoad] = useState(60)
  const handleDatetimeLocalChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDatetimeLocal(e.target.value)
    console.log('datetimeLocal:', e.target.value)
    console.dir(e.target)
  }
  const handleMathAChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number.parseFloat(e.target.value)
    const safeValue = Number.isNaN(nextValue) ? 0 : nextValue
    setMathA(safeValue)
    console.log('mathA:', safeValue)
    console.dir(e.target)
  }
  const handleMathBChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number.parseFloat(e.target.value)
    const safeValue = Number.isNaN(nextValue) ? 0 : nextValue
    setMathB(safeValue)
    console.log('mathB:', safeValue)
    console.dir(e.target)
  }
  const handleTaskProgressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number.parseInt(e.target.value, 10)
    const safeValue = Number.isNaN(nextValue) ? 0 : nextValue
    setTaskProgress(safeValue)
    console.log('taskProgress:', safeValue)
    console.dir(e.target)
  }
  const handleSystemLoadChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number.parseInt(e.target.value, 10)
    const safeValue = Number.isNaN(nextValue) ? 0 : nextValue
    setSystemLoad(safeValue)
    console.log('systemLoad:', safeValue)
    console.dir(e.target)
  }
  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const form = e.target as HTMLFormElement;
  //   const usernameOld =
  //     (form.elements.namedItem("username") as HTMLInputElement)?.value ?? "";
  //   const passwordOld =
  //     (form.elements.namedItem("password") as HTMLInputElement)?.value ?? "";
  //   console.log("username (旧写法):", usernameOld);
  //   console.log("password (旧写法):", passwordOld);

  //   const formData = new FormData(form);
  //   const usernameNew = formData.get("username")?.toString() ?? "";
  //   const passwordNew = formData.get("password")?.toString() ?? "";
  //   console.log("username (FormData):", usernameNew);
  //   console.log("password (FormData):", passwordNew);

  //   console.dir(form);
  // };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget

    // 旧写法：通过 form.elements.namedItem 获取
    const usernameOld =
      (form.elements.namedItem('username') as HTMLInputElement | null)?.value ?? ''
    const passwordOld =
      (form.elements.namedItem('password') as HTMLInputElement | null)?.value ?? ''
    console.log('username (namedItem):', usernameOld)
    console.log('password (namedItem):', passwordOld)

    // FormData 写法：更加语义化，也能直接上传文件
    const formData = new FormData(form)
    const username = formData.get('username')?.toString() ?? ''
    const password = formData.get('password')?.toString() ?? ''
    console.log('username (FormData):', username)
    console.log('password (FormData):', password)

    console.dir(form)
  }

  const formARef = useRef<HTMLFormElement>(null)
  const formBRef = useRef<HTMLFormElement>(null)

  const handleCombinedSubmit = () => {
    const formAData = formARef.current ? new FormData(formARef.current) : new FormData()
    const formBData = formBRef.current ? new FormData(formBRef.current) : new FormData()
    const payload = {
      profile: Object.fromEntries(formAData.entries()),
      contact: Object.fromEntries(formBData.entries()),
    }

    console.log('组合提交 payload:', payload)
    alert(`组合提交数据：\n${JSON.stringify(payload, null, 2)}`)
  }
  const mathSum = mathA + mathB
  const meterAccent = systemLoad < 40 ? '#60a5fa' : systemLoad > 80 ? '#f87171' : '#34d399'
  const textInputClass =
    'w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 shadow-sm transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30'
  const selectClass = `${textInputClass} cursor-pointer`
  const controlLabelClass = 'block space-y-2 text-sm text-slate-200'
  const checkboxClass =
    'h-4 w-4 rounded border-white/20 bg-slate-900 text-sky-400 focus:ring-sky-500/40'
  const radioClass = 'h-4 w-4 border-white/20 text-sky-400 focus:ring-sky-500/40'
  const textareaClass =
    'w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 shadow-sm transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30'
  const subtlePanelClass =
    'rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-lg shadow-black/20'
  const navLinkClass =
    'flex items-center justify-between rounded-xl border border-transparent px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-500/30 hover:bg-sky-500/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500'
  const statCardClass =
    'rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur transition hover:border-sky-400/40 hover:bg-sky-400/10'
  const accentRangeClass = 'w-full accent-sky-500'
  const primaryButtonClass =
    'inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-900/40 transition hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500'
  const secondaryButtonClass =
    'inline-flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900/60 px-4 py-2 text-sm font-semibold text-slate-100 shadow-sm transition hover:border-sky-400/40 hover:bg-sky-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500'
  const quickLinks = [
    { id: 'basic-inputs', label: '基础控件' },
    { id: 'upload-numeric', label: '上传与数值' },
    { id: 'date-range', label: '日期与范围' },
    { id: 'textarea', label: '文本域' },
    { id: 'form-submit', label: '表单提交' },
    { id: 'combined-forms', label: '组合表单' },
    { id: 'fieldset', label: 'Fieldset' },
    { id: 'assist-display', label: '辅助展示' },
    { id: 'select-variations', label: 'Select 进阶' },
    { id: 'controlled-form', label: '统一受控' },
  ]
  const totalFieldCount = Object.keys(formDemo).length + 18
  const summaryStats = [
    { label: '已配置字段', value: totalFieldCount.toString() },
    { label: '当前选中文件', value: selectedFiles.length.toString() },
    { label: '满意度预览', value: `${satisfaction}/10` },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="mx-auto h-[700px] max-w-4xl rounded-full bg-sky-500/20 blur-[160px]" />
        </div>
        <div className="relative">
          <div className="grid gap-10 lg:grid-cols-[280px,1fr]">
            <aside className="space-y-6 lg:sticky lg:top-10 lg:h-fit">
              <section className="space-y-5 rounded-3xl border border-white/15 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur">
                <div>
                  <h2 className="text-lg font-semibold text-white">状态速览</h2>
                  <p className="mt-1 text-xs text-slate-200/70">交互结果即时更新</p>
                </div>
                <ul className="space-y-3 text-sm text-slate-200/80">
                  <li className="flex items-center justify-between gap-3">
                    <span className="text-slate-400">协议</span>
                    <span className="font-semibold text-white">{agree ? '已同意' : '未同意'}</span>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span className="text-slate-400">主题颜色</span>
                    <span className="font-semibold text-white">{color}</span>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span className="text-slate-400">国家</span>
                    <span className="font-semibold text-white">{country}</span>
                  </li>
                  <li className="space-y-1">
                    <p className="text-slate-400">兴趣</p>
                    <p className="text-xs text-slate-200/70">
                      {hobbies.length ? hobbies.join('、') : '尚未选择'}
                    </p>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span className="text-slate-400">满意度</span>
                    <span className="font-semibold text-white">{satisfaction}/10</span>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span className="text-slate-400">任务进度</span>
                    <span className="font-semibold text-white">{taskProgress}%</span>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span className="text-slate-400">系统负载</span>
                    <span className="font-semibold text-white">{systemLoad}</span>
                  </li>
                </ul>
                {selectedFiles.length > 0 ? (
                  <div className="rounded-2xl border border-sky-400/30 bg-sky-400/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-sky-100">
                      已选择文件
                    </p>
                    <ul className="mt-2 space-y-1 text-xs text-sky-100">
                      {selectedFiles.map(file => (
                        <li key={file.name} className="flex items-center justify-between gap-3">
                          <span className="truncate">{file.name}</span>
                          <span className="text-slate-200/70">{(file.size / 1024).toFixed(1)} KB</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">尚未选择文件</p>
                )}
              </section>

              <nav className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-black/40 backdrop-blur">
                <h2 className="text-lg font-semibold text-white">快速导航</h2>
                <div className="mt-4 flex flex-col gap-2">
                  {quickLinks.map(link => (
                    <a key={link.id} href={`#${link.id}`} className={navLinkClass}>
                      <span>{link.label}</span>
                      <span className="text-xs text-slate-400">&gt;</span>
                    </a>
                  ))}
                </div>
              </nav>
            </aside>

            <main className="space-y-12">
              <section className="overflow-hidden rounded-3xl border border-sky-400/30 bg-gradient-to-br from-sky-500/20 via-blue-500/10 to-indigo-500/20 p-8 shadow-2xl backdrop-blur">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-200/80">
                      Form Playground
                    </p>
                    <h1 className="text-3xl font-bold text-white sm:text-4xl">表单控件体验馆</h1>
                    <p className="max-w-xl text-sm leading-relaxed text-slate-100/80">
                      将 React 受控组件与原生表单能力结合，快速预览每种控件的输入和状态反馈，随时复制到你的项目中。
                    </p>
                  </div>
                  <div className="flex h-fit items-center gap-3 rounded-2xl border border-white/20 bg-slate-900/40 px-4 py-3 text-sm text-slate-100/80 shadow-lg">
                    <span className="rounded-full bg-sky-500/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-100">
                      即时更新
                    </span>
                    <span>所有示例均为完全受控组件</span>
                  </div>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {summaryStats.map(stat => (
                    <article key={stat.label} className={statCardClass}>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-100/70">
                        {stat.label}
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
                    </article>
                  ))}
                </div>
              </section>

              <SectionCard
                id="basic-inputs"
                title="基础控件"
                description="复选框、单选框、下拉框等原生控件的受控写法与状态展示。"
              >
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className={`${subtlePanelClass} space-y-5`}>
                    <label className="flex items-start gap-3 text-sm text-slate-200">
                      <input
                        ref={checkboxRef}
                        className={checkboxClass}
                        type="checkbox"
                        checked={agree}
                        onChange={handleCheckboxChange}
                      />
                      <span>
                        <span className="font-semibold text-white">同意协议</span>
                        <span className="mt-1 block text-xs text-slate-400">
                          改变选中状态可立即在右侧看到反馈。
                        </span>
                      </span>
                    </label>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        主题颜色
                      </p>
                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-200">
                        <label className="inline-flex items-center gap-2">
                          <input
                            className={radioClass}
                            type="radio"
                            name="color"
                            value="red"
                            checked={color === 'red'}
                            onChange={handleRadioChange}
                          />
                          红色
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input
                            className={radioClass}
                            type="radio"
                            name="color"
                            value="blue"
                            checked={color === 'blue'}
                            onChange={handleRadioChange}
                          />
                          蓝色
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input
                            className={radioClass}
                            type="radio"
                            name="color"
                            value="green"
                            checked={color === 'green'}
                            onChange={handleRadioChange}
                          />
                          绿色
                        </label>
                      </div>
                    </div>

                    <label className={controlLabelClass}>
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        国家（只能选择预设选项）
                      </span>
                      <select
                        className={selectClass}
                        name="country"
                        value={country}
                        onChange={handleCountryChange}
                        required
                      >
                        <option value="china">中国</option>
                        <option value="usa">美国</option>
                        <option value="japan">日本</option>
                        <option value="germany">德国</option>
                      </select>
                    </label>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        兴趣爱好（多选）
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <label className="flex items-center gap-2 text-sm text-slate-200">
                          <input
                            className={checkboxClass}
                            type="checkbox"
                            name="hobby"
                            value="reading"
                            checked={hobbies.includes('reading')}
                            onChange={handleMultiCheckboxChange}
                          />
                          阅读
                        </label>
                        <label className="flex items-center gap-2 text-sm text-slate-200">
                          <input
                            className={checkboxClass}
                            type="checkbox"
                            name="hobby"
                            value="music"
                            checked={hobbies.includes('music')}
                            onChange={handleMultiCheckboxChange}
                          />
                          音乐
                        </label>
                        <label className="flex items-center gap-2 text-sm text-slate-200">
                          <input
                            className={checkboxClass}
                            type="checkbox"
                            name="hobby"
                            value="sports"
                            checked={hobbies.includes('sports')}
                            onChange={handleMultiCheckboxChange}
                          />
                          运动
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className={`${subtlePanelClass} space-y-4`}>
                    <h3 className="text-sm font-semibold text-white">实时反馈</h3>
                    <ul className="space-y-3 text-sm text-slate-200/80">
                      <li>
                        协议状态：<span className="font-semibold text-white">{agree ? '已选中' : '未选中'}</span>
                      </li>
                      <li>
                        颜色选择：<span className="font-semibold text-white">{color}</span>
                      </li>
                      <li>
                        国家：<span className="font-semibold text-white">{country}</span>
                      </li>
                      <li>
                        兴趣：{' '}
                        <span className="font-semibold text-white">
                          {hobbies.length ? hobbies.join('、') : '暂无'}
                        </span>
                      </li>
                    </ul>
                    <p className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-xs leading-relaxed text-slate-400">
                      这些控件全部受控于 React 状态，适合作为学习如何统一管理输入值的快速参考。
                    </p>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                id="upload-numeric"
                title="上传与数值"
                description="文件上传、数字输入以及多种输入类型的受控演示。"
              >
                <div className="grid gap-6 xl:grid-cols-3">
                  <div className={`${subtlePanelClass} space-y-4 xl:col-span-2`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-white">文件上传</h3>
                        <p className="mt-1 text-xs text-slate-400">
                          支持 accept / multiple / capture / hidden 字段。
                        </p>
                      </div>
                      <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs font-semibold text-sky-200">
                        Demo
                      </span>
                    </div>
                    <input
                      className="block w-full cursor-pointer rounded-xl border border-dashed border-white/20 bg-slate-950/70 px-4 py-3 text-sm text-slate-200 transition hover:border-sky-400/40 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                      type="file"
                      accept="image/*,.pdf"
                      multiple
                      capture="environment"
                      onChange={handleFileChange}
                    />
                    <input type="hidden" name="token" value={hiddenToken} />
                    <p className="text-xs text-slate-400">
                      上传字段会与隐藏 token 一起提交，可用于附带额外上下文。
                    </p>
                    {selectedFiles.length > 0 ? (
                      <ul className="grid gap-2 rounded-2xl border border-sky-400/20 bg-sky-400/5 p-4 text-xs text-sky-100">
                        {selectedFiles.map(file => (
                          <li key={file.name} className="flex items-center justify-between gap-3">
                            <span className="truncate">{file.name}</span>
                            <span>{(file.size / 1024).toFixed(1)} KB</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs italic text-slate-500">尚未选择任何文件。</p>
                    )}
                  </div>

                  <div className={`${subtlePanelClass} space-y-4`}>
                    <h3 className="text-sm font-semibold text-white">数值控制</h3>
                    <label className={controlLabelClass}>
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        价格（0.5 步长，0 - 10）
                      </span>
                      <input
                        className={textInputClass}
                        type="number"
                        min="0"
                        max="10"
                        step="0.5"
                        value={price}
                        onChange={handlePriceChange}
                      />
                    </label>
                    <p className="text-sm text-slate-200/80">当前价格：{price.toFixed(2)} 元</p>
                    <div className="grid gap-3 text-sm text-slate-200/80">
                      <label className="space-y-1">
                        <span className="text-xs text-slate-400">密码</span>
                        <input
                          className={textInputClass}
                          type="password"
                          value={password}
                          onChange={handlePasswordChange}
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="text-xs text-slate-400">搜索</span>
                        <input
                          className={textInputClass}
                          type="search"
                          value={search}
                          onChange={handleSearchChange}
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="text-xs text-slate-400">电话</span>
                        <input
                          className={textInputClass}
                          type="tel"
                          value={tel}
                          onChange={handleTelChange}
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="text-xs text-slate-400">URL</span>
                        <input className={textInputClass} type="url" value={url} onChange={handleUrlChange} />
                      </label>
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                id="date-range"
                title="日期与范围"
                description="日期时间、步长限制以及 range 输入的组合使用。"
              >
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className={`${subtlePanelClass} space-y-4`}>
                    <label className={controlLabelClass}>
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        日期时间
                      </span>
                      <input
                        className={textInputClass}
                        type="datetime-local"
                        value={datetimeLocal}
                        onChange={handleDatetimeLocalChange}
                      />
                    </label>
                    <p className="text-xs text-slate-400">当前：{datetimeLocal || '尚未选择'}</p>

                    <label className={controlLabelClass}>
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        会议日期（步长 7 天）
                      </span>
                      <input
                        className={textInputClass}
                        type="date"
                        min="2024-01-01"
                        step="7"
                        value={meetingDate}
                        onChange={handleMeetingDateChange}
                      />
                    </label>
                    <p className="text-xs text-slate-400">已选择：{meetingDate || '尚未选择'}</p>
                  </div>

                  <div className={`${subtlePanelClass} space-y-5`}>
                    <div>
                      <label className="flex items-center justify-between text-sm text-slate-200">
                        <span>满意度（0 - 10）</span>
                        <span className="font-semibold text-white">{satisfaction}</span>
                      </label>
                      <input
                        className={accentRangeClass}
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        value={satisfaction}
                        onChange={handleRangeChange}
                      />
                    </div>

                    <div>
                      <label className={controlLabelClass}>
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          城市（带 datalist）
                        </span>
                        <input
                          className={textInputClass}
                          list="city-options"
                          value={city}
                          onChange={handleCityChange}
                        />
                      </label>
                      <datalist id="city-options">
                        <option value="北京" />
                        <option value="上海" />
                        <option value="广州" />
                        <option value="深圳" />
                      </datalist>
                      <p className="text-xs text-slate-400">当前城市：{city || '尚未输入'}</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-xs text-slate-400">
                      使用 range / datalist / date / datetime-local 的组合可以快速构建配置面板。
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                id="textarea"
                title="文本域"
                description="不同 wrap 策略与字数统计，帮助更好地收集用户输入。"
              >
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className={`${subtlePanelClass} space-y-3`}>
                    <label className={controlLabelClass}>
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        个人简介（限制 200 字）
                      </span>
                      <textarea
                        className={textareaClass}
                        rows={6}
                        maxLength={200}
                        placeholder="请输入 200 字以内的个人简介"
                        spellCheck
                        value={bio}
                        onChange={handleBioChange}
                      />
                    </label>
                    <p className="text-xs text-slate-400">字数：{bio.length}/200</p>
                  </div>

                  <div className={`${subtlePanelClass} space-y-3`}>
                    <label className={controlLabelClass}>
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        反馈（wrap="soft"）
                      </span>
                      <textarea
                        className={textareaClass}
                        rows={6}
                        wrap="soft"
                        placeholder="软换行：提交时不一定包含 \\r\\n"
                        value={feedback}
                        onChange={handleFeedbackChange}
                      />
                    </label>
                  </div>

                  <div className={`${subtlePanelClass} space-y-3`}>
                    <label className={controlLabelClass}>
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        会议记录（wrap="hard"）
                      </span>
                      <textarea
                        className={textareaClass}
                        rows={6}
                        wrap="hard"
                        placeholder="硬换行：提交时会包含换行符"
                        value={hardWrap}
                        onChange={handleHardWrapChange}
                      />
                    </label>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                id="form-submit"
                title="表单提交"
                description="展示原生 form 提交、图片按钮以及 form* 属性的使用方式。"
              >
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr),320px]">
                  <div className={`${subtlePanelClass} space-y-4`}>
                    <h3 className="text-sm font-semibold text-white">图片提交按钮</h3>
                    <p className="text-xs text-slate-400">
                      点击图片与点击 button 等价，适合需要视觉定制的场景。
                    </p>
                    <form action="/api/image-submit" method="post" className="flex items-center gap-4">
                      <input
                        className="h-12 w-[160px] rounded-xl border border-sky-400/40 bg-sky-500/40 text-white shadow-lg shadow-sky-900/40"
                        type="image"
                        src="https://dummyimage.com/160x48/0ea5e9/ffffff&text=立即提交"
                        alt="图片提交按钮"
                        width={160}
                        height={48}
                      />
                    </form>
                  </div>

                  <div className={`${subtlePanelClass} space-y-4`}>
                    <h3 className="text-sm font-semibold text-white">登录表单</h3>
                    <p className="text-xs text-slate-400">使用 form* 属性在表单外部触发提交。</p>
                    <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
                      <label className={controlLabelClass}>
                        <span className="text-xs text-slate-400">用户名</span>
                        <input
                          className={textInputClass}
                          type="text"
                          name="username"
                          placeholder="输入用户名"
                          required
                        />
                      </label>
                      <label className={controlLabelClass}>
                        <span className="text-xs text-slate-400">密码</span>
                        <input
                          className={textInputClass}
                          type="password"
                          name="password"
                          placeholder="输入密码"
                          required
                        />
                      </label>
                      <button type="submit" className={primaryButtonClass}>
                        表单内部提交
                      </button>
                    </form>
                    <button
                      type="submit"
                      form="login-form"
                      formAction="/api/login"
                      formMethod="post"
                      formNoValidate
                      formTarget="_blank"
                      className={secondaryButtonClass}
                    >
                      表单外部提交（form* 属性示例）
                    </button>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                id="combined-forms"
                title="组合表单"
                description="多个表单拆分填写，通过代码组合成统一的 payload。"
              >
                <div className="space-y-4">
                  <div className="grid gap-6 lg:grid-cols-2">
                    <form ref={formARef} className={`${subtlePanelClass} space-y-4`}>
                      <h3 className="text-sm font-semibold text-white">表单 A：个人信息</h3>
                      <label className={controlLabelClass}>
                        <span className="text-xs text-slate-400">姓名</span>
                        <input className={textInputClass} type="text" name="fullName" placeholder="姓名" />
                      </label>
                      <label className={controlLabelClass}>
                        <span className="text-xs text-slate-400">年龄</span>
                        <input className={textInputClass} type="number" name="age" placeholder="年龄" />
                      </label>
                    </form>

                    <form ref={formBRef} className={`${subtlePanelClass} space-y-4`}>
                      <h3 className="text-sm font-semibold text-white">表单 B：联系方式</h3>
                      <label className={controlLabelClass}>
                        <span className="text-xs text-slate-400">邮箱</span>
                        <input className={textInputClass} type="email" name="email" placeholder="邮箱" />
                      </label>
                      <label className={controlLabelClass}>
                        <span className="text-xs text-slate-400">电话</span>
                        <input className={textInputClass} type="tel" name="phone" placeholder="电话" />
                      </label>
                    </form>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button type="button" className={primaryButtonClass} onClick={handleCombinedSubmit}>
                      组合提交（手动合并数据）
                    </button>
                    <p className="text-xs text-slate-400">
                      点击按钮时会分别读取 FormData，再拼成统一 payload。
                    </p>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                id="fieldset"
                title="Fieldset"
                description="使用 fieldset / legend 分组输入，并对整个区域禁用。"
              >
                <form className="grid gap-6 lg:grid-cols-2">
                  <fieldset className={`${subtlePanelClass} space-y-4`}>
                    <legend className="px-2 text-sm font-semibold text-white">账号信息</legend>
                    <label className={controlLabelClass}>
                      <span className="text-xs text-slate-400">用户名</span>
                      <input className={textInputClass} type="text" name="fieldset-username" placeholder="用户名" />
                    </label>
                    <label className={controlLabelClass}>
                      <span className="text-xs text-slate-400">电子邮箱</span>
                      <input className={textInputClass} type="email" name="fieldset-email" placeholder="邮箱" />
                    </label>
                  </fieldset>

                  <fieldset className={`${subtlePanelClass} space-y-4`} disabled>
                    <legend className="px-2 text-sm font-semibold text-slate-300">禁用信息</legend>
                    <label className={controlLabelClass}>
                      <span className="text-xs text-slate-400">电话</span>
                      <input
                        className={textInputClass}
                        type="tel"
                        name="fieldset-phone"
                        defaultValue="123-4567-8901"
                      />
                    </label>
                    <label className={controlLabelClass}>
                      <span className="text-xs text-slate-400">地址</span>
                      <input
                        className={textInputClass}
                        type="text"
                        name="fieldset-address"
                        defaultValue="示例地址"
                      />
                    </label>
                    <p className="text-xs text-slate-500">
                      整个 fieldset 被 disabled，内部控件均不可编辑。
                    </p>
                  </fieldset>
                </form>
              </SectionCard>

              <SectionCard
                id="assist-display"
                title="辅助展示"
                description="output、progress、meter 等展示类元素的结合。"
              >
                <div className="grid gap-6 lg:grid-cols-3">
                  <form className={`${subtlePanelClass} space-y-4`} onSubmit={e => e.preventDefault()}>
                    <h3 className="text-sm font-semibold text-white">output：展示计算结果</h3>
                    <label className={controlLabelClass} htmlFor="math-a">
                      <span className="text-xs text-slate-400">数值 A</span>
                      <input
                        className={textInputClass}
                        id="math-a"
                        type="number"
                        step={10}
                        value={mathA}
                        onChange={handleMathAChange}
                        aria-describedby="math-sum"
                      />
                    </label>
                    <label className={controlLabelClass} htmlFor="math-b">
                      <span className="text-xs text-slate-400">数值 B</span>
                      <input
                        className={textInputClass}
                        id="math-b"
                        type="number"
                        value={mathB}
                        onChange={handleMathBChange}
                      />
                    </label>
                    <output
                      id="math-sum"
                      className="block rounded-xl border border-white/10 bg-slate-900/70 p-3 font-mono text-lg text-sky-100"
                      htmlFor="math-a math-b"
                      name="sum"
                    >
                      {mathSum}
                    </output>
                    <p className="text-xs text-slate-400">
                      output 的 htmlFor 指向关联输入，适合表单校验或动态计算。
                    </p>
                  </form>

                  <div className={`${subtlePanelClass} space-y-4`}>
                    <h3 className="text-sm font-semibold text-white">progress：任务进度</h3>
                    <label
                      className="flex items-center justify-between text-sm text-slate-200"
                      htmlFor="task-progress-input"
                    >
                      <span>调整进度（0 - 100）</span>
                      <span className="font-semibold text-white">{taskProgress}%</span>
                    </label>
                    <input
                      className={accentRangeClass}
                      id="task-progress-input"
                      type="range"
                      min="0"
                      max="100"
                      step="10"
                      value={taskProgress}
                      onChange={handleTaskProgressChange}
                    />
                    <progress
                      id="task-progress"
                      className="block h-3 w-full rounded-full bg-slate-800"
                      value={taskProgress}
                      max={100}
                    />
                    <output htmlFor="task-progress-input task-progress" className="text-xs text-slate-400">
                      当前进度：{taskProgress}%
                    </output>
                  </div>

                  <div className={`${subtlePanelClass} space-y-4`}>
                    <h3 className="text-sm font-semibold text-white">meter：区间提示</h3>
                    <label
                      className="flex items-center justify-between text-sm text-slate-200"
                      htmlFor="system-load-input"
                    >
                      <span>系统负载</span>
                      <span className="font-semibold text-white">{systemLoad}</span>
                    </label>
                    <input
                      className={accentRangeClass}
                      id="system-load-input"
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={systemLoad}
                      onChange={handleSystemLoadChange}
                    />
                    <meter
                      id="system-load-meter"
                      className="block h-3 w-full"
                      min={0}
                      max={100}
                      low={40}
                      high={80}
                      optimum={60}
                      value={systemLoad}
                      style={{ accentColor: meterAccent }}
                    />
                    <output htmlFor="system-load-input system-load-meter" className="text-xs text-slate-400">
                      低于 40 或高于 80 将显示不同色彩提醒。
                    </output>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                id="select-variations"
                title="Select 进阶"
                description="多选、可见项数量、禁用状态以及 optgroup 的组合。"
              >
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className={`${subtlePanelClass} space-y-4`}>
                    <label className={controlLabelClass}>
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        多选国家（multiple）
                      </span>
                      <select
                        className={selectClass}
                        multiple
                        value={selectedCountries}
                        onChange={handleSelectedCountriesChange}
                        size={4}
                      >
                        <option value="china">中国</option>
                        <option value="usa">美国</option>
                        <option value="japan">日本</option>
                        <option value="germany">德国</option>
                        <option value="france">法国</option>
                      </select>
                    </label>
                    <p className="text-xs text-slate-400">
                      已选择：{selectedCountries.join('、') || '无'}
                    </p>
                  </div>

                  <div className={`${subtlePanelClass} space-y-4`}>
                    <label className={controlLabelClass}>
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        可见选项数量
                      </span>
                      <select className={selectClass} value={sizeSelection} onChange={handleSizeSelectionChange}>
                        <option value="2">显示 2 行</option>
                        <option value="3">显示 3 行</option>
                        <option value="4">显示 4 行</option>
                      </select>
                    </label>

                    <label className={controlLabelClass}>
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        城市列表（受 size 控制）
                      </span>
                      <select className={selectClass} size={Number.parseInt(sizeSelection, 10)}>
                        <option value="beijing">北京</option>
                        <option value="shanghai">上海</option>
                        <option value="guangzhou">广州</option>
                        <option value="shenzhen">深圳</option>
                      </select>
                    </label>

                    <label className={controlLabelClass}>
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        禁用状态示例
                      </span>
                      <select className={selectClass} disabled defaultValue="disabled">
                        <option value="disabled">已禁用</option>
                        <option value="others">其他选项</option>
                      </select>
                    </label>
                  </div>

                  <div className={`${subtlePanelClass} space-y-4 lg:col-span-2`}>
                    <label className={controlLabelClass}>
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        带 optgroup 与禁用项
                      </span>
                      <select className={selectClass} value={favoriteCity} onChange={handleFavoriteCityChange}>
                        <optgroup label="华东">
                          <option value="shanghai" label="上海（直辖市）">
                            上海
                          </option>
                          <option value="hangzhou">杭州</option>
                        </optgroup>
                        <optgroup label="华南" disabled>
                          <option value="guangzhou">广州</option>
                          <option value="shenzhen">深圳</option>
                        </optgroup>
                        <option value="beijing" disabled>
                          北京（已禁用）
                        </option>
                      </select>
                    </label>
                    <p className="text-xs text-slate-400">当前选择：{favoriteCity}</p>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                id="controlled-form"
                title="统一受控"
                description="一个 onChange 管理所有字段的完整示例。"
              >
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr),320px]">
                  <form className={`${subtlePanelClass} space-y-5`} onSubmit={handleFormDemoSubmit}>
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className={controlLabelClass}>
                        <span className="text-xs text-slate-400">用户名</span>
                        <input
                          className={textInputClass}
                          type="text"
                          name="username"
                          value={formDemo.username}
                          onChange={handleFormDemoChange}
                          placeholder="请输入用户名"
                          required
                        />
                      </label>
                      <label className={controlLabelClass}>
                        <span className="text-xs text-slate-400">邮箱</span>
                        <input
                          className={textInputClass}
                          type="email"
                          name="email"
                          value={formDemo.email}
                          onChange={handleFormDemoChange}
                          placeholder="example@mail.com"
                          required
                        />
                      </label>
                      <label className={controlLabelClass}>
                        <span className="text-xs text-slate-400">年龄</span>
                        <input
                          className={textInputClass}
                          type="number"
                          name="age"
                          value={formDemo.age}
                          onChange={handleFormDemoChange}
                          min="0"
                          max="150"
                        />
                      </label>
                      <label className="flex items-center gap-3 text-sm text-slate-200">
                        <input
                          className={checkboxClass}
                          type="checkbox"
                          name="subscribe"
                          checked={formDemo.subscribe}
                          onChange={handleFormDemoChange}
                        />
                        订阅新闻邮件
                      </label>
                    </div>

                    <fieldset className={`${subtlePanelClass} space-y-3 border border-dashed border-white/15`}>
                      <legend className="px-2 text-sm font-semibold text-white">性别</legend>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-200">
                        <label className="inline-flex items-center gap-2">
                          <input
                            className={radioClass}
                            type="radio"
                            name="gender"
                            value="female"
                            checked={formDemo.gender === 'female'}
                            onChange={handleFormDemoChange}
                          />
                          女
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input
                            className={radioClass}
                            type="radio"
                            name="gender"
                            value="male"
                            checked={formDemo.gender === 'male'}
                            onChange={handleFormDemoChange}
                          />
                          男
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input
                            className={radioClass}
                            type="radio"
                            name="gender"
                            value="other"
                            checked={formDemo.gender === 'other'}
                            onChange={handleFormDemoChange}
                          />
                          其他
                        </label>
                      </div>
                    </fieldset>

                    <label className={controlLabelClass}>
                      <span className="text-xs text-slate-400">国家</span>
                      <select
                        className={selectClass}
                        name="country"
                        value={formDemo.country}
                        onChange={handleFormDemoChange}
                      >
                        <option value="china">中国</option>
                        <option value="usa">美国</option>
                        <option value="japan">日本</option>
                        <option value="germany">德国</option>
                      </select>
                    </label>

                    <div className="grid gap-4 md:grid-cols-2">
                      <label className={controlLabelClass}>
                        <span className="text-xs text-slate-400">技能（多选）</span>
                        <select
                          className={selectClass}
                          name="skills"
                          multiple
                          value={formDemo.skills}
                          onChange={handleFormDemoChange}
                          size={4}
                        >
                          <option value="react">React</option>
                          <option value="vue">Vue</option>
                          <option value="angular">Angular</option>
                          <option value="svelte">Svelte</option>
                        </select>
                      </label>

                      <label className={controlLabelClass}>
                        <span className="text-xs text-slate-400">喜欢的颜色（多选）</span>
                        <select
                          className={selectClass}
                          name="colors"
                          multiple
                          value={formDemo.colors}
                          onChange={handleFormDemoChange}
                          size={4}
                        >
                          <option value="red">红色</option>
                          <option value="green">绿色</option>
                          <option value="blue">蓝色</option>
                          <option value="purple">紫色</option>
                        </select>
                      </label>
                    </div>

                    <fieldset className={`${subtlePanelClass} space-y-3 border border-dashed border-white/15`}>
                      <legend className="px-2 text-sm font-semibold text-white">兴趣爱好（复选）</legend>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-200">
                        {[
                          { value: 'coding', label: '编程' },
                          { value: 'music', label: '音乐' },
                          { value: 'travel', label: '旅行' },
                        ].map(option => (
                          <label key={option.value} className="inline-flex items-center gap-2">
                            <input
                              className={checkboxClass}
                              type="checkbox"
                              name="interests"
                              value={option.value}
                              checked={formDemo.interests.includes(option.value)}
                              onChange={handleFormDemoChange}
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <fieldset className={`${subtlePanelClass} space-y-3 border border-dashed border-white/15`}>
                      <legend className="px-2 text-sm font-semibold text-white">联系方式偏好</legend>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-200">
                        <label className="inline-flex items-center gap-2">
                          <input
                            className={radioClass}
                            type="radio"
                            name="contactPref"
                            value="email"
                            checked={formDemo.contactPref === 'email'}
                            onChange={handleFormDemoChange}
                          />
                          邮件
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input
                            className={radioClass}
                            type="radio"
                            name="contactPref"
                            value="phone"
                            checked={formDemo.contactPref === 'phone'}
                            onChange={handleFormDemoChange}
                          />
                          电话
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input
                            className={radioClass}
                            type="radio"
                            name="contactPref"
                            value="message"
                            checked={formDemo.contactPref === 'message'}
                            onChange={handleFormDemoChange}
                          />
                          短信
                        </label>
                      </div>
                    </fieldset>

                    <label className={controlLabelClass}>
                      <span className="text-xs text-slate-400">个人介绍</span>
                      <textarea
                        className={textareaClass}
                        name="bio"
                        rows={4}
                        placeholder="简单介绍一下自己"
                        value={formDemo.bio}
                        onChange={handleFormDemoChange}
                      />
                    </label>

                    <div className="flex flex-wrap gap-3">
                      <button type="submit" className={primaryButtonClass}>
                        提交
                      </button>
                      <button type="button" className={secondaryButtonClass} onClick={handleFormDemoReset}>
                        重置
                      </button>
                    </div>
                  </form>

                  <div className={`${subtlePanelClass} space-y-3`}>
                    <h3 className="text-sm font-semibold text-white">当前表单状态</h3>
                    <p className="text-xs text-slate-400">受控表单每次输入都会更新 JSON。</p>
                    <pre className="max-h-[360px] overflow-auto rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-xs text-slate-100">
                      {JSON.stringify(formDemo, null, 2)}
                    </pre>
                  </div>
                </div>
              </SectionCard>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}

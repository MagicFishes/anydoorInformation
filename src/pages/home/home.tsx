import { type ChangeEvent, type ReactNode, useRef, useState } from 'react'

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
    <section id={id}>
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        {description ? <p className="text-sm text-slate-500">{description}</p> : null}
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
  const textInputClass =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200'
  const selectClass = `${textInputClass} cursor-pointer`
  const controlLabelClass = 'block space-y-1 text-sm text-slate-600'
  const checkboxClass = 'h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-300'
  const radioClass = 'h-4 w-4 border-slate-300 text-sky-500 focus:ring-sky-300'
  const textareaClass =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200'
  const subtlePanelClass = 'rounded-xl border border-slate-200 bg-slate-50/80 p-4 shadow-inner'
  return (
    <div className="p-[2rem]">
      <label>
        <input ref={checkboxRef} type="checkbox" checked={agree} onChange={handleCheckboxChange} />
        同意协议
      </label>

      <div>
        <label>
          <input
            type="radio"
            name="color"
            value="red"
            // checked={color === "red"}
            onChange={handleRadioChange}
          />
          红色
        </label>
        <label>
          <input
            type="radio"
            name="color"
            value="blue"
            // checked={color === "blue"}
            onChange={handleRadioChange}
          />
          蓝色
        </label>
      </div>
      {/* select */}
      <div>
        <label className="block space-y-1">
          <span>国家（只能选择预设选项）</span>
          <select name="country" value={country} onChange={handleCountryChange} required>
            <option value="china">中国</option>
            <option value="usa">美国</option>
            <option value="japan">日本</option>
            <option value="germany">德国</option>
          </select>
        </label>
        <p>当前国家：{country}</p>
      </div>

      <div className="mt-4 space-y-2">
        <p>兴趣爱好（多选）：</p>
        <label>
          <input
            type="checkbox"
            name="hobby"
            value="reading"
            checked={hobbies.includes('reading')}
            onChange={handleMultiCheckboxChange}
          />
          阅读
        </label>
        <label>
          <input
            type="checkbox"
            name="hobby"
            value="music"
            checked={hobbies.includes('music')}
            onChange={handleMultiCheckboxChange}
          />
          音乐
        </label>
        <label>
          <input
            type="checkbox"
            name="hobby"
            value="sports"
            checked={hobbies.includes('sports')}
            onChange={handleMultiCheckboxChange}
          />
          运动
        </label>
      </div>

      <div className="mt-4 space-y-2">
        <p>
          当前状态：checkbox = {agree ? '已选中' : '未选中'}，radio = {color}，多选 ={' '}
          {hobbies.join(', ') || '无'}
        </p>
        {selectedFiles.length > 0 && (
          <ul className="list-disc pl-5">
            {selectedFiles.map(file => (
              <li key={file.name}>
                {file.name}（{(file.size / 1024).toFixed(1)} KB）
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <p>文件上传：</p>
        <input
          type="file"
          accept="image/*,.pdf"
          multiple
          capture="environment"
          onChange={handleFileChange}
        />
        <p className="text-sm text-gray-500">
          accept 限制可选类型，multiple 允许多选，capture 可指定移动端摄像头。
        </p>
        <input type="hidden" name="token" value={hiddenToken} />
        <p className="text-sm text-gray-500">隐藏字段会随表单一起提交，用于附加数据。</p>
      </div>
      {/* number with step */}
      <div>
        <label className="block space-y-1">
          <span>价格（0.5 元步长，0-10）</span>
          <input
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={price}
            onChange={handlePriceChange}
          />
        </label>
        <p>当前价格：{price.toFixed(2)}</p>
      </div>
      {/* password */}
      <div>
        <input type="password" value={password} onChange={handlePasswordChange} />
        <p>密码：{password}</p>
      </div>
      {/* search */}
      <div>
        <input type="search" value={search} onChange={handleSearchChange} />
        <p>搜索：{search}</p>
      </div>
      {/* tel */}
      <div>
        <input type="tel" value={tel} onChange={handleTelChange} />
        <p>电话：{tel}</p>
      </div>
      {/* url */}
      <div>
        <input type="url" value={url} onChange={handleUrlChange} />
        <p>URL：{url}</p>
      </div>
      {/* datetime-local */}
      <div>
        <input type="datetime-local" value={datetimeLocal} onChange={handleDatetimeLocalChange} />
        <p>日期时间：{datetimeLocal}</p>
      </div>
      {/* date with step */}
      <div>
        <label className="block space-y-1">
          <span>会议日期（以 7 天为步长）</span>
          <input
            type="date"
            min="2024-01-01"
            step="7"
            value={meetingDate}
            onChange={handleMeetingDateChange}
          />
        </label>
        <p>会议日期：{meetingDate || '尚未选择'}</p>
      </div>
      {/* range slider */}
      <div>
        <label className="block space-y-1">
          <span>满意度（滑动范围 0 - 10，步长 1）</span>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={satisfaction}
            onChange={handleRangeChange}
          />
        </label>
        <p>当前满意度：{satisfaction}</p>
      </div>
      {/* datalist */}
      <div>
        <label className="block space-y-1">
          <span>城市（带建议列表，可输入自定义）</span>
          <input list="city-options" value={city} onChange={handleCityChange} />
        </label>
        <datalist id="city-options">
          <option value="北京" />
          <option value="上海" />
          <option value="广州" />
          <option value="深圳" />
        </datalist>
        <p>当前城市：{city}</p>
      </div>
      {/* textarea */}
      <div className="space-y-4">
        <div>
          <label className="block space-y-1">
            <span>个人简介（rows/cols + placeholder + spellCheck）</span>
            <textarea
              rows={4}
              cols={40}
              maxLength={200}
              placeholder="请输入 200 字以内的个人简介"
              spellCheck
              value={bio}
              onChange={handleBioChange}
            />
          </label>
          <p>字数：{bio.length}/200</p>
        </div>

        <div>
          <label className="block space-y-1">
            <span>反馈（wrap="soft"）</span>
            <textarea
              rows={4}
              wrap="soft"
              placeholder="软换行：回车会显示换行，但提交时不一定包含 \\r\\n（取决于浏览器）"
              value={feedback}
              onChange={handleFeedbackChange}
            />
          </label>
        </div>

        <div>
          <label className="block space-y-1">
            <span>会议记录（wrap="hard"）</span>
            <textarea
              rows={4}
              wrap="hard"
              placeholder="硬换行：提交时会包含换行符"
              value={hardWrap}
              onChange={handleHardWrapChange}
            />
          </label>
        </div>
      </div>

      {/* image button */}
      <div>
        <p>图片提交按钮示例：</p>
        <form action="/api/image-submit" method="post">
          <input
            type="image"
            src="https://dummyimage.com/120x40/60a5fa/ffffff&text=立即提交"
            alt="图片提交按钮"
            width={120}
            height={40}
          />
        </form>
        <p className="text-sm text-gray-500">
          点击图片会像按钮一样提交表单。也可以使用 button 包裹图片保持按钮语义。
        </p>
      </div>

      {/* form：演示 form* 系列属性 */}
      <div className="mt-6 space-y-2">
        <p>登录表单（展示 form 系列属性的用法）：</p>
        <form id="login-form" onSubmit={handleSubmit}>
          <label className="block space-y-1">
            <span>用户名</span>
            <input type="text" name="username" placeholder="输入用户名" required />
          </label>
          <label className="block space-y-1">
            <span>密码</span>
            <input type="password" name="password" placeholder="输入密码" required />
          </label>
          <button type="submit">表单内部提交</button>
        </form>

        {/* 这个按钮不在 form 内部，通过 form 属性挂到 id=login-form 上 */}
        <button
          type="submit"
          form="login-form"
          formAction="/api/login"
          formMethod="post"
          formNoValidate
          formTarget="_blank"
        >
          表单外部提交（form* 属性示例）
        </button>
        <p className="text-sm text-gray-500">
          form 指向目标表单，其余 form* 属性可以覆盖 action、method、target 等设置。 在 React SPA
          中通常仍会在 onSubmit 里阻止默认提交，这里仅作演示。
        </p>
      </div>

      {/* 多表单组合提交示例 */}
      <div className="mt-10 space-y-4">
        <p>多个表单，一个按钮统一收集数据：</p>

        <form ref={formARef} className="space-y-2 border p-4">
          <h3 className="font-semibold">表单 A：个人信息</h3>
          <label className="block space-y-1">
            <span>姓名</span>
            <input type="text" name="fullName" placeholder="姓名" />
          </label>
          <label className="block space-y-1">
            <span>年龄</span>
            <input type="number" name="age" placeholder="年龄" />
          </label>
        </form>

        <form ref={formBRef} className="space-y-2 border p-4">
          <h3 className="font-semibold">表单 B：联系方式</h3>
          <label className="block space-y-1">
            <span>邮箱</span>
            <input type="email" name="email" placeholder="邮箱" />
          </label>
          <label className="block space-y-1">
            <span>电话</span>
            <input type="tel" name="phone" placeholder="电话" />
          </label>
        </form>

        <button type="button" onClick={handleCombinedSubmit}>
          组合提交（手动收集多个表单）
        </button>
        <p className="text-sm text-gray-500">
          使用 FormData 分别收集每个表单的字段，再在代码中组合成统一 payload 提交。
        </p>
      </div>

      {/* fieldset + legend */}
      <div className="mt-10 space-y-4">
        <p>fieldset / legend 示例：</p>
        <form className="space-y-4">
          <fieldset className="border p-4">
            <legend className="px-2 font-semibold">账号信息</legend>
            <label className="block space-y-1">
              <span>用户名</span>
              <input type="text" name="fieldset-username" placeholder="用户名" />
            </label>
            <label className="block space-y-1">
              <span>电子邮箱</span>
              <input type="email" name="fieldset-email" placeholder="邮箱" />
            </label>
          </fieldset>

          <fieldset className="border p-4" disabled>
            <legend className="px-2 font-semibold">禁用信息（fieldset disabled）</legend>
            <label className="block space-y-1">
              <span>电话</span>
              <input type="tel" name="fieldset-phone" defaultValue="123-4567-8901" />
            </label>
            <label className="block space-y-1">
              <span>地址</span>
              <input type="text" name="fieldset-address" defaultValue="示例地址" />
            </label>
            <p className="text-sm text-gray-500">整个 fieldset 被 disabled，内部控件都不可编辑。</p>
          </fieldset>
        </form>
      </div>
      {/* 辅助与显示组件 */}
      <div className="mt-10 space-y-6">
        <p>辅助与显示组件示例：</p>
        <form className="space-y-4 rounded border p-4" onSubmit={e => e.preventDefault()}>
          <h3 className="font-semibold">output：展示计算结果</h3>
          <label className="block space-y-1" htmlFor="math-a">
            <span>数值 A</span>
            <input
              id="math-a"
              type="number"
              step={10}
              value={mathA}
              onChange={handleMathAChange}
              aria-describedby="math-sum"
            />
          </label>
          <label className="block space-y-1" htmlFor="math-b">
            <span>数值 B</span>
            <input id="math-b" type="number" value={mathB} onChange={handleMathBChange} />
          </label>
          <output
            id="math-sum"
            className="block rounded bg-gray-100 p-2 font-mono"
            htmlFor="math-a math-b"
            name="sum"
          >
            {mathSum}
          </output>
          <p className="text-sm text-gray-500">
            output 的 htmlFor 指向关联的输入，适合展示计算或表单校验结果。
          </p>
        </form>
        <div className="rounded border p-4">
          <h3 className="font-semibold">progress：表示任务进度</h3>
          <label className="block space-y-1" htmlFor="task-progress-input">
            <span>调整进度（0-100）</span>
            <input
              id="task-progress-input"
              type="range"
              min="0"
              max="100"
              step="10"
              value={taskProgress}
              onChange={handleTaskProgressChange}
            />
          </label>
          <progress
            id="task-progress"
            className="block h-3 w-full"
            value={taskProgress}
            max={100}
          />
          <output htmlFor="task-progress-input task-progress" className="text-sm text-gray-600">
            当前进度：{taskProgress}%
          </output>
        </div>
        <div className="rounded border p-4">
          <h3 className="font-semibold">meter：展示值在区间中的位置</h3>
          <label className="block space-y-1" htmlFor="system-load-input">
            <span>系统负载（理想值 60，低于 40 或高于 80 提醒）</span>
            <input
              id="system-load-input"
              type="range"
              min="0"
              max="100"
              step="5"
              value={systemLoad}
              onChange={handleSystemLoadChange}
            />
          </label>
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
          <output htmlFor="system-load-input system-load-meter" className="text-sm text-gray-600">
            当前负载：{systemLoad}
          </output>
        </div>
      </div>
      {/* select variations */}
      <div className="mt-10 space-y-4">
        <p>select 组件更多用法：</p>

        <div>
          <label className="block space-y-1">
            <span>多选国家（multiple）</span>
            <select
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
          <p>已选择：{selectedCountries.join(', ') || '无'}</p>
        </div>

        <div>
          <label className="block space-y-1">
            <span>可见选项数量（size）设置</span>
            <select value={sizeSelection} onChange={handleSizeSelectionChange}>
              <option value="2">显示 2 行</option>
              <option value="3">显示 3 行</option>
              <option value="4">显示 4 行</option>
            </select>
          </label>

          <label className="block space-y-1">
            <span>城市列表（受 size 控制）</span>
            <select size={Number.parseInt(sizeSelection, 10)}>
              <option value="beijing">北京</option>
              <option value="shanghai">上海</option>
              <option value="guangzhou">广州</option>
              <option value="shenzhen">深圳</option>
            </select>
          </label>
        </div>

        <div>
          <label className="block space-y-1">
            <span>禁用状态示例</span>
            <select disabled defaultValue="disabled">
              <option value="disabled">已禁用</option>
              <option value="others">其他选项</option>
            </select>
          </label>
        </div>

        <div>
          <label className="block space-y-1">
            <span>选择城市（带 label、optgroup、禁用项）</span>
            <select value={favoriteCity} onChange={handleFavoriteCityChange}>
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
          <p>当前选择：{favoriteCity}</p>
        </div>
      </div>

      {/* 统一受控表单示例 */}
      <div className="mt-10 space-y-4">
        <p>统一受控表单（一个 onChange 管理全部字段）：</p>
        <form className="space-y-4 border p-4" onSubmit={handleFormDemoSubmit}>
          <label className="block space-y-1">
            <span>用户名</span>
            <input
              type="text"
              name="username"
              value={formDemo.username}
              onChange={handleFormDemoChange}
              placeholder="请输入用户名"
              required
            />
          </label>

          <label className="block space-y-1">
            <span>邮箱</span>
            <input
              type="email"
              name="email"
              value={formDemo.email}
              onChange={handleFormDemoChange}
              placeholder="example@mail.com"
              required
            />
          </label>

          <label className="block space-y-1">
            <span>年龄</span>
            <input
              type="number"
              name="age"
              value={formDemo.age}
              onChange={handleFormDemoChange}
              min="0"
              max="150"
            />
          </label>

          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              name="subscribe"
              checked={formDemo.subscribe}
              onChange={handleFormDemoChange}
            />
            订阅新闻邮件
          </label>

          <fieldset className="border p-4">
            <legend className="px-2 font-semibold">性别</legend>
            <label className="inline-flex items-center gap-2">
              <input
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
                type="radio"
                name="gender"
                value="other"
                checked={formDemo.gender === 'other'}
                onChange={handleFormDemoChange}
              />
              其他
            </label>
          </fieldset>

          <label className="block space-y-1">
            <span>国家</span>
            <select name="country" value={formDemo.country} onChange={handleFormDemoChange}>
              <option value="china">中国</option>
              <option value="usa">美国</option>
              <option value="japan">日本</option>
              <option value="germany">德国</option>
            </select>
          </label>

          <label className="block space-y-1">
            <span>技能（多选 select）</span>
            <select
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

          <label className="block space-y-1">
            <span>喜欢的颜色（多选）</span>
            <select
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

          <fieldset className="border p-4">
            <legend className="px-2 font-semibold">兴趣爱好（复选框）</legend>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="interests"
                value="coding"
                checked={formDemo.interests.includes('coding')}
                onChange={handleFormDemoChange}
              />
              编程
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="interests"
                value="music"
                checked={formDemo.interests.includes('music')}
                onChange={handleFormDemoChange}
              />
              音乐
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="interests"
                value="travel"
                checked={formDemo.interests.includes('travel')}
                onChange={handleFormDemoChange}
              />
              旅行
            </label>
          </fieldset>

          <fieldset className="border p-4">
            <legend className="px-2 font-semibold">联系方式偏好（单选）</legend>
            <label className="inline-flex items-center gap-2">
              <input
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
                type="radio"
                name="contactPref"
                value="message"
                checked={formDemo.contactPref === 'message'}
                onChange={handleFormDemoChange}
              />
              短信
            </label>
          </fieldset>

          <label className="block space-y-1">
            <span>个人介绍</span>
            <textarea
              name="bio"
              rows={4}
              placeholder="简单介绍一下自己"
              value={formDemo.bio}
              onChange={handleFormDemoChange}
            />
          </label>

          <div className="flex gap-3">
            <button type="submit">提交</button>
            <button type="button" onClick={handleFormDemoReset}>
              重置
            </button>
          </div>
        </form>

        <div>
          <p>当前表单状态：</p>
          <pre className="whitespace-pre-wrap rounded bg-gray-100 p-2 text-sm">
            {JSON.stringify(formDemo, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}

// 引入
import Footer from '@/components/footer/footer'
import Header from '@/components/header/header'
import LiquidEther from './LiquidEther/LiquidEther'

export default function HomePage() {
  const [info, setInfo] = useState<string>('我是首页')

  return (
    <div className="w-[100%] min-h-screen flex flex-col ">
      <div className="h-[50px] w-[100%]">
        <Header></Header>
      </div>
      <div className="  flex-1">
        {/* {Array.from({ length: 100 }).map((_, index) => (
                    <div key={index}>{info}</div>
                ))} */}
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <LiquidEther
            colors={['#5227FF', '#FF9FFC', '#B19EEF']}
            mouseForce={50} // 鼠标影响力，值越大效果越明显
            cursorSize={30} // 光标大小
            isViscous={false} // 启用粘性
            viscous={20} // 粘性系数，值越小越流畅
            // iterationsViscous={16} // 粘性迭代
            // iterationsPoisson={16} // 泊松迭代
            resolution={0.6} // 分辨率
            isBounce={false} // 防止液体撞墙消失
            autoDemo={false} // 保持自动演示
            autoSpeed={0.3} // 大幅降低自动演示速度
            autoIntensity={1.0} // 降低自动演示强度
            takeoverDuration={100} // 缩短接管时间
            autoResumeDelay={100} // 延长自动演示恢复延迟
            autoRampDuration={100} // 增加过渡时间
          />
        </div>
      </div>
      <div className="h-[100px] w-[100%]">
        <Footer title="我是"></Footer>
      </div>
    </div>
  )
}

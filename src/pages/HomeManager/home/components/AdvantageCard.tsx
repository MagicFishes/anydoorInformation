interface AdvantageItem {
  image: string
  title: string
  description: string
  bgColor: string
}

interface AdvantageCardProps {
  item: AdvantageItem
}

// 底部 3 列中的单个卡片
export const AdvantageCard = ({ item }: AdvantageCardProps) => {
  return (
    <div className="w-full py-[30rem] px-[50rem] border-[1px] border-solid border-gray-300 ">
      <div className="flex flex-col h-full justify-between">
        <div className="flex justify-center ">
          <div
            className="w-[50rem] h-[50rem]  flex justify-center items-center rounded-[50%] mb-[10rem]"
            style={{ backgroundColor: item.bgColor }}
          >
            <img className="w-[30rem] h-[30rem]" src={item.image} alt="" />
          </div>
        </div>
        <div className="text-[18rem] font-bold tracking-[1rem] text-center mb-[10rem]">
          {item.title}
        </div>
        <div className="text-[14rem] text-gray-400 text-center">{item.description}</div>
      </div>
    </div>
  )
}



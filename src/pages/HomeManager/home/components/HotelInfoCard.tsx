import { useTranslation } from 'react-i18next'
import type { QueryOrderInfoRes } from '@/api/types/home'

// 单独抽离的酒店信息卡片，只在 PC 端该页面使用
interface HotelInfoCardProps {
  orderInfo: QueryOrderInfoRes['data'] | null
  // 复用父组件的日期格式化逻辑，避免在这里重复实现
  formatDate: (dateString: string) => string
}

export const HotelInfoCard = ({ orderInfo, formatDate }: HotelInfoCardProps) => {
  const { t } = useTranslation()

  return (
    <div className="w-[32.7%] border-[1px] border-solid border-gray-300">
      {/* 图片酒店信息 */}
      <div className="w-full min-h-[180rem] ">
        <img
          src={orderInfo?.hotelThumbnail || '/image/home/home1.png'}
          alt={orderInfo?.hotelName || ''}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full p-[20rem] ">
        {/* 酒店信息 */}
        <div className="text-[14rem] flex-col flex mb-[20rem] border-b-[1rem] border-solid border-gray-300 pb-[20rem]">
          <div className="text-[18rem] mb-[5rem] tracking-[2rem]">
            {orderInfo?.hotelName || t('酒店名称')}
          </div>
          <div className="text-[14rem] text-gray-400 ">{orderInfo?.hotelEnName || ''}</div>
          <div className="text-[14rem] text-gray-400 ">{orderInfo?.hotelAddress || ''}</div>
        </div>

        {/* 入住信息 */}
        <div className="text-[14rem] flex-col flex ">
          {/* 入住日期 */}
          <div className="flex justify-between">
            <div className="text-[14rem] flex-col flex mb-[15rem] ">
              <div className="text-gray-400 mb-[5rem] ">{t('入住日期')}</div>
              <div className="text-[16rem] font-bold tracking-[1rem]">
                {orderInfo?.checkIn ? formatDate(orderInfo.checkIn) : '-'}
              </div>
            </div>
            <div className="text-[14rem] flex-col flex mb-[15rem]">
              <div className="text-gray-400 text-end mb-[5rem] ">{t('离店日期')}</div>
              <div className="text-[16rem] font-bold text-end tracking-[1rem]">
                {orderInfo?.checkOut ? formatDate(orderInfo.checkOut) : '-'}
              </div>
            </div>
          </div>

          {/* 入住人信息 */}
          {orderInfo?.customerInfos.map((item, index) => (
            <div key={index} className="text-[14rem] flex-col flex mb-[15rem] ">
              <div className="flex justify-between mb-[5rem] text-gray-400">
                <div>{t('名字')}</div>
                <div>{t('姓氏')}</div>
              </div>
              <div className="flex justify-between font-bold tracking-[1rem]">
                <div>{item.firstName}</div>
                <div>{item.lastName}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 房型 */}
        <div className="text-[14rem] flex flex-col mb-[15rem] ">
          <div className="flex justify-between mb-[5rem] text-gray-400 ">
            <div>{t('房型')}</div>
            <div>{t('数量')}</div>
          </div>
          <div className="flex justify-between font-bold tracking-[1rem]">
            <div>{orderInfo?.roomName || ''}</div>
            <div className="min-w-[20%] text-end">x{orderInfo?.roomNum || ''}</div>
          </div>
        </div>

        {/* 总价 */}
        <div className="text-[16rem] mb-[5rem] flex flex-col border-t-[1px] border-solid border-gray-300 pt-[20rem] mt-[20rem] ">
          <div className="flex justify-between mb-[5rem] font-bold tracking-[1rem]">
            <div className="text-gray-400">{t('总价')}</div>
            <div className="font-bold tracking-[1rem]">
              {orderInfo?.currency}
              {orderInfo?.amount || ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



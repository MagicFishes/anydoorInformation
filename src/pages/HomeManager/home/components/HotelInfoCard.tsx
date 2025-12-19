import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EnvironmentOutlined, CalendarOutlined, ClockCircleOutlined, UserOutlined, CheckCircleOutlined, StarFilled, DownOutlined, UpOutlined } from '@ant-design/icons'
import type { QueryOrderInfoRes } from '@/api/types/home'

// 单独抽离的酒店信息卡片，PC 端和移动端共用
interface HotelInfoCardProps {
  selectType: string
  orderInfo: QueryOrderInfoRes['data'] | null
  // 复用父组件的日期格式化逻辑，避免在这里重复实现
  formatDate: (dateString: string) => string
  // 可选的 className，用于覆盖默认样式（如移动端需要全宽）
  className?: string
}

export const HotelInfoCard = ({
  selectType,
  orderInfo,
  formatDate,
  className,
}: HotelInfoCardProps) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  // 计算入住天数
  const calculateNights = () => {
    if (!orderInfo?.checkIn || !orderInfo?.checkOut) return 0
    const checkIn = new Date(orderInfo.checkIn)
    const checkOut = new Date(orderInfo.checkOut)
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const nights = calculateNights()
  const adultsCount = orderInfo?.customerInfos?.length || 0

  return (
    <div className={`w-[32.7%] rounded-[12px] border-[1px] border-solid border-gray-300 overflow-hidden bg-white ${className || ''}`}>
      {/* 图片酒店信息 */}
      <div className="w-full min-h-[180rem] relative">
        <img
          src={orderInfo?.hotelThumbnail || '/image/home/home1.png'}
          alt={orderInfo?.hotelName || t('酒店图片')}
          className="w-full h-full object-cover"
        />
        {/* 已验证商户徽章 */}
        <div className="absolute top-[16rem] left-[16rem] bg-[#28A745] rounded-[6px] px-[12rem] py-[6rem] flex items-center gap-[6rem]">
          <CheckCircleOutlined className="text-white text-[14rem]" />
          <span className="text-white text-[12rem] font-semibold">{t('已验证商户')}</span>
        </div>
        {/* 预订参考号 */}
        {/* <div className="absolute top-[16rem] right-[16rem] text-right">
          <div className="text-[#9ca3af] text-[11rem] mb-[2rem]"># {t('预订参考')}</div>
          <div className="text-white text-[13rem] font-semibold">RES-{orderInfo?.orderNo?.slice(-8) || 'XXXX-XXXX'}</div>
        </div> */}
      </div>

      <div className="w-full p-[24rem] bg-white">
        {/* 酒店信息 */}
        <div className="mb-[24rem]">
          {/* 星级 */}
          <div className="flex items-center gap-[4rem] mb-[12rem]">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarFilled key={star} className="text-[#D4AF37] text-[16rem]" />
            ))}
          </div>
          
          {/* 酒店名称 - 使用大号粗体衬线风格 */}
          <div className="text-gray-900 text-[28rem] font-bold mb-[8rem] tracking-[1rem] leading-[1.2] font-serif">
            {orderInfo?.hotelName || t('酒店名称')}
          </div>
          
          {/* 酒店地址 */}
          <div className="flex items-center gap-[6rem] text-gray-600 text-[14rem]">
            <EnvironmentOutlined className="text-gray-600 text-[14rem]" />
            <span>{orderInfo?.hotelAddress || orderInfo?.hotelEnName || t('地址信息暂无')}</span>
          </div>
        </div>

        {/* 入住/退房信息 */}
        <div className="flex justify-between mb-[24rem] pb-[24rem] border-b border-gray-200">
          {/* 入住日期 */}
          <div className="flex-1">
            <div className="flex items-center gap-[6rem] text-gray-600 text-[12rem] mb-[8rem]">
              <CalendarOutlined className="text-gray-600 text-[14rem]" />
              <span>{t('入住日期')}</span>
            </div>
            <div className="text-gray-900 text-[24rem] font-bold mb-[4rem]">
              {orderInfo?.checkIn ? formatDate(orderInfo.checkIn) : t('暂无')}
            </div>
            <div className="bg-gray-50 rounded-[6px] px-[10rem] py-[6rem] inline-flex items-center gap-[6rem]">
              <ClockCircleOutlined className="text-gray-700 text-[12rem]" />
              <span className="text-gray-700 text-[12rem]">{t('从')} 15:00</span>
            </div>
          </div>

          {/* 分隔线 */}
          <div className="w-[1px] bg-gray-200 mx-[16rem]"></div>

          {/* 退房日期 */}
          <div className="flex-1 text-right">
            <div className="flex items-center justify-end gap-[6rem] text-gray-600 text-[12rem] mb-[8rem]">
              <CalendarOutlined className="text-gray-600 text-[14rem]" />
              <span>{t('离店日期')}</span>
            </div>
            <div className="text-gray-900 text-[24rem] font-bold mb-[4rem]">
              {orderInfo?.checkOut ? formatDate(orderInfo.checkOut) : t('暂无')}
            </div>
            <div className="bg-gray-50 rounded-[6px] px-[10rem] py-[6rem] inline-flex items-center gap-[6rem] ml-auto">
              <ClockCircleOutlined className="text-gray-700 text-[12rem]" />
              <span className="text-gray-700 text-[12rem]">{t('至')} 12:00</span>
            </div>
          </div>
        </div>

        {/* 房间详情与政策 */}
        <div className="bg-gray-50 rounded-[8px] p-[16rem] mb-[24rem]">
          {/* 房型 */}
          <div className="flex items-center justify-between mb-[12rem]">
            <div className="text-gray-900 text-[16rem] font-bold flex items-center gap-[8rem]">
              <span>{orderInfo?.roomName || t('房型')}</span>
              <CheckCircleOutlined className="text-[#28A745] text-[16rem]" />
            </div>
          </div>
          
          {/* 成人和晚数 */}
          {/* mb-[12rem] pb-[12rem]  */}
          <div className=" border-gray-200">
            <div className="flex items-center gap-[16rem] mb-[12rem]">
              <div 
                className="flex items-center gap-[6rem] text-gray-600 text-[14rem] cursor-pointer hover:text-gray-900 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <UserOutlined className="text-gray-600 text-[14rem]" />
                <span>{adultsCount} {t('位成人')}</span>
                {orderInfo?.customerInfos && orderInfo.customerInfos.length > 0 && (
                  <span className="ml-[4rem]">
                    {isExpanded ? <UpOutlined className="text-[12rem]" /> : <DownOutlined className="text-[12rem]" />}
                  </span>
                )}
              </div>
              <div className="w-[1px] h-[16rem] bg-gray-300"></div>
              <div className="flex items-center gap-[6rem] text-gray-600 text-[14rem]">
                <ClockCircleOutlined className="text-gray-600 text-[14rem]" />
                <span>{nights} {t('晚')}</span>
              </div>
            </div>
            
            {/* 展开的入住人信息 */}
            {isExpanded && orderInfo?.customerInfos && orderInfo.customerInfos.length > 0 && (
              <div className="mt-[12rem] pt-[12rem] border-t border-gray-200">
                {/* 表头 */}
                <div className="flex items-center justify-between mb-[8rem] pb-[8rem] border-b border-gray-200">
                  <div className="text-gray-500 text-[13rem] font-medium">{t('名字')}</div>
                  <div className="text-gray-500 text-[13rem] font-medium">{t('姓氏')}</div>
                </div>
                {/* 内容行 */}
                {orderInfo.customerInfos.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between mb-[8rem] last:mb-0">
                    <div className="text-gray-700 text-[13rem]">{customer.firstName || '-'}</div>
                    <div className="text-gray-700 text-[13rem]">{customer.lastName || '-'}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 免费取消政策 */}
          {/* <div className="flex items-center gap-[6rem] text-[#28A745] text-[13rem]">
            <CheckCircleOutlined className="text-[14rem]" />
            <span>{t('24小时前免费取消')}</span>
          </div> */}
        </div>

        {/* 总价 */}
        <div className="pt-[20rem] border-t border-gray-200 flex justify-between">
          <div className="text-gray-600 text-[20rem] mb-[8rem] flex items-center font-bold">{t('总价')}</div>
          <div className="flex items-baseline   flex-col text-end  ">
            <div className="text-[#D4AF37] text-[32rem] font-bold   tracking-[1rem] ">
             <span  className='mr-[10rem] text-[18rem]'> {orderInfo?.currency || ''}</span>
              {selectType == 'creditCard'
                ? (orderInfo?.amount !== undefined && orderInfo?.amount !== null
                    ? orderInfo.amount.toLocaleString()
                    : t('暂无'))
                : (orderInfo?.payAmount !== undefined && orderInfo?.payAmount !== null
                    ? orderInfo.payAmount.toLocaleString()
                    : t('暂无'))}
            </div>

            {selectType != 'creditCard' &&
              orderInfo?.payAmount !== '' &&
              orderInfo?.amount !== orderInfo?.payAmount && (
              <div className="text-gray-700 text-[11rem] mt-[4rem] text-end w-[100%]">
              {t('包含')} {orderInfo?.currency || ''}
              {orderInfo?.amount && orderInfo?.payAmount
                ? (orderInfo.amount - parseFloat(orderInfo.payAmount)).toFixed(2)
                : t('0.00')}
              {t('税费及手续费')}
            </div>
          )}
          </div>
      
        </div>
      </div>
    </div>
  )
}

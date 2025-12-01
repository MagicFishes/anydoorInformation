import {get,post} from "@/utils/request";
import { QueryOrderInfoRes,
   CreatePayInfoParams,
    CreatePayInfoRes,
    QueryPayInfoRes
   } from "./types/home";
export default class Home{
   /** 
 * 查询订单信息
 * @param {string} languageCode 
  * @param {string} base64OrderNo 
  * @returns
 */
static async queryOrderInfo(languageCode: string, base64OrderNo: string) {
    return get<QueryOrderInfoRes>(`/prepay/pay/${languageCode}/${base64OrderNo}`);
  }

  /** 
 * 创建支付订单
 * @param {object} params CreatePayInfoDTO
 * @param {number} params.orderNo 订单编号
 * @param {string} params.payChannel 支付渠道    WX_PAY  ALI_PAY
 * @returns
 */
static async createPayInfo(params: CreatePayInfoParams) {
  return post<CreatePayInfoRes>(`/prepay/pay`, params);
}

/**   轮询
 * 查询查询支付单状态
 * @param {string} payInfoId 
  * @returns
 */
static async queryPayInfo(payInfoId: number) {
  return get<QueryPayInfoRes>(`/prepay/pay/status/${payInfoId}`);
}

}
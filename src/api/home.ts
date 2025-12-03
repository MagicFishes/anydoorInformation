import {get,post} from "@/utils/request";
import { QueryOrderInfoRes,
   CreatePayInfoParams,
    CreatePayInfoRes,
    QueryPayInfoRes,
    SubmitCreditCardParams,
    SubmitCreditCardRes
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
 * @param {string} params.orderNo 订单编号
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

/** 
 * 提交担保信用卡
 * @param {object} params CreateGuaranteeInfoDTO
 * @param {string} params.orderNo 订单编号
 * @param {string} params.cardCode 信用卡代码，VISA/MASTER
 * @param {string} params.cardNumber 信用卡号码，4148460110707180
 * @param {string} params.expireDate 信用卡过期日期，10/28
 * @param {string} params.cardSecurityCode 信用卡安全码，644
 * @returns
 */
static async submitCreditCard(params: SubmitCreditCardParams) {
  return post<SubmitCreditCardRes>(`/prepay/pay/credit`, params);
}
}
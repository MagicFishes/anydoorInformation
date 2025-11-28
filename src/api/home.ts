import {get} from "@/utils/request";
import { QueryOrderInfoRes } from "./types/home";
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
}
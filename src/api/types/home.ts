// 响应接口
export interface QueryOrderInfoRes {
    code: string;
    message: string;
    data: {
      orderNo: string;
      hotelId: number;
      hotelName: string;
      hotelThumbnail: string;
      hotelEnName: string;
      hotelAddress: string;
      roomTypeId: number;
      roomName: string;
      customerInfos: {
        lastName: string;
        firstName: string;
      }[];
      roomNum: number;
      amount: number;
      currency: string;
      checkIn: string;
      checkOut: string;
      payType:string;//ALL、CREDIT、PAY   CREDIT:担保信用卡，PAY :支付
      isGuarantee:boolean;//是否担保
      payState:string;//\SUCCESS  PROGRESS
    };
    version: string;
    timestamp: string;
  }
  // 参数接口
export interface CreatePayInfoParams {
  orderNo: string;
  payChannel: string;
  encodeLinkNo:string;
}

// 响应接口
export interface CreatePayInfoRes {
  code: string;
  message: string;
  data: {
    payInfoId: number;
    payBody: string;
    createdTime?: string; // 创建日期 yyyy-MM-dd HH:mm:ss
  };
  version: string;
  timestamp: string;
}
// 响应接口
export interface QueryPayInfoRes {
  code: string;
  message: string;
  data: string;
  version: string;
  timestamp: string;
}
// 参数接口
export interface SubmitCreditCardParams {
  orderNo: string;
  cardCode: string;
  cardNumber: string;
  expireDate: string;
  cardSecurityCode?: string;
  encodeLinkNo:string;
}

// 响应接口
export interface SubmitCreditCardRes {
  code: string;
  message: string;
  data: Record<string, unknown>;
  version: string;
  timestamp: string;
}

  
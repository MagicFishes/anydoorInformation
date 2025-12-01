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
    };
    version: string;
    timestamp: string;
  }
  // 参数接口
export interface CreatePayInfoParams {
  orderNo: string;
  payChannel: string;
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

  
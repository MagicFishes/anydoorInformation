// 响应接口
export interface QueryOrderInfoRes {
    code: string;
    message: string;
    data: {
      orderNo: number;
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
  
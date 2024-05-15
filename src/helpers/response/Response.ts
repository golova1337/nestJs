import { CommonResponse } from '../types/response-type';

export class Response {
  static succsessfully(result): CommonResponse<any> {
    return {
      status: true,
      error: false,
      message: 'Successfully',
      meta: result.meta || {},
      data: result.data,
    };
  }
}

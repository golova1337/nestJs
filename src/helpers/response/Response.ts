import { CommonResponse } from '../types/response-type';

type Result<T> = {
  data: T;
  meta?: object;
};

export class Response {
  static succsessfully<T>(result: Result<T>): CommonResponse<T> {
    return {
      status: true,
      error: false,
      message: 'Successfully',
      meta: result.meta || {},
      data: result.data,
    };
  }
}

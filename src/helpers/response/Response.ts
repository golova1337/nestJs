import { responseSuccesfully } from '../types/response-type';

export class Response {
  static succsessfully(result): responseSuccesfully {
    return {
      status: true,
      error: false,
      ...result,
    };
  }
}

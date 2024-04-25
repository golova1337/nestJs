import { responseSuccesfully } from '../types/response-type';

export class Response {
  static succsessfully(obj): responseSuccesfully {
    return {
      status: true,
      error: false,
      ...obj,
    };
  }
}

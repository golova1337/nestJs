import { responseSuccesfully } from '../types/response-type';

export class Response {
  static succsessfully(obj): responseSuccesfully {
    return {
      status: true,
      message: obj.massage,
      id: obj.id,
      email: obj.email,
      meta: obj.meta,
      error: false,
    };
  }
}

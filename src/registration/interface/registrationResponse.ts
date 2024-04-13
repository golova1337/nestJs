import { ResponseSuccsesfully, Result } from './registragion.interface';

export class RegistrationResponse {
  static succsessfully(obj: Result): ResponseSuccsesfully {
    return {
      status: true,
      message: obj.massage,
      id: obj.id,
      email: obj.email,
      meta: obj.meta,
      error: false,
    };
  }
  static unsuccessfully(error) {
    return {
      status: false,
      message: error.message,
      data: null,
      error: error.code,
    };
  }
}

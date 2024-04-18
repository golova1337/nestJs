import {
  ResponseSuccsesfully,
  Result,
} from '../../authentication/interface/auth.interface';

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
}

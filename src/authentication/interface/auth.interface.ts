import { userRoles } from 'src/enum/userRoles.enum';

export interface Result {
  massage: string;
  id: string;
  email?: string;
  meta: object;
}

export interface ResponseSuccsesfully {
  status: boolean;
  message: string;
  id: string;
  email: string;
  meta: object;
  error: boolean;
}
export interface ResponseUnsuccsesfully {
  status: boolean;
  message: string;
  data: null;
  error: string;
}

export interface JwtPayload {
  id: string;
  role: userRoles;
}

export interface Login {
  email: string;
  password: string;
}

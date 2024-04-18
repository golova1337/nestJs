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
  meta: null;
  error: string;
}

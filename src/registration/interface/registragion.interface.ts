export interface Result {
  massage: string;
  id: string;
  email: string;
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
  email: string;
  id: string;
}

export interface Login {
  email: string;
  password: string;
  user: {
    id: string;
    email: string;
    password: string;
    tokens: { tokens: string; signedAt: string }[];
    __v: number;
  };
}

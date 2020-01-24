export type LoginAction = {
  identifier: string,
  password: string
};

export type RegisterAction = {
  email: string,
  password: string,
  username: string
};

export type ForgotPasswordAction = {
  email: string,
  url: string
}

export type ResetPasswordAction = {
  code: string,
  password: string,
  passwordConfirmation: string
}

export type SetCookieAction = {
  key: string,
  value: string
};

export type DelCookieAction = string;

export type ApiError = {
  statusCode: number,
  error: any,
  message: any
}

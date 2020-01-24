import AuthStore from '../store';

export interface ISignIn {
  ds: AuthStore;
  identifier: string;
  password: string;
  errors: {
    identifier: string;
    password: string;
  };
  isLoading: boolean;
  isValid: boolean;
  invalidEmailMsg: string;
  passwordWrongLenMsg: string;
  passwordWrongSymbolsMsg: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  emailLabel: string|undefined;
  passwordLabel: string|undefined;
  validateInput(): void;
  fieldType(fieldName: string): string|undefined;
  login(): Promise<any>;
  onLoginSuccess(): void;
}

export interface ISignUp {
  ds: AuthStore;
  email: string;
  password: string;
  rePassword: string;
  username: string;
  errors: {
    email: string;
    password: string;
    username: string;
    rePassword: string;
  };
  isLoading: boolean;
  isValid: boolean;
  invalidEmailMsg: string;
  userAlreadyExistsMsg: string;
  passwordWrongLenMsg: string;
  passwordWrongSymbolsMsg: string;
  passwordsDontMatchMsg: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  rePasswordPlaceholder: string;
  usernamePlaceholder: string;
  emailLabel: string|undefined;
  passwordLabel: string|undefined;
  rePasswordLabel: string|undefined;
  usernameLabel: string|undefined;
  validateInput(): void;
  fieldType(fieldName: string): string|undefined
  register(): Promise<any>;
  checkEmail(): Promise<any>;
  onRegisterSuccess(): void;
}

export interface IForgotPassword {
  ds: AuthStore;
  identifier: string;
  errors: {
    identifier: string;
  };
  isLoading: boolean;
  isValid: boolean;
  invalidEmailMsg: string;
  emailPlaceholder: string;
  emailLabel: string|undefined;
  validateInput(): void;
  fieldType(fieldName: string): string|undefined
  send(): Promise<any>;
  onSendSuccess(): void;
}

export interface IResetPassword {
  ds: AuthStore;
  token: string;
  password: string;
  rePassword: string;
  errors: {
    token: string;
    password: string;
    rePassword: string;
  };
  isLoading: boolean;
  isValid: boolean;
}
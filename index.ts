import signin from './components/SignIn.vue';
import signup from './components/SignUp.vue';
import resetPassword from './components/ResetPassword.vue';
import forgotPassword from './components/ForgotPassword.vue';
import authStore from './store';
import axiosClient from './services/client';
import * as middlewares from './middlewares';

import { VueClass } from 'vue-class-component/lib/declarations';
import {ISignUp,ISignIn,IForgotPassword,IResetPassword} from './components/types';

export const SignIn: VueClass<ISignIn> = signin;
export const SignUp: VueClass<ISignUp> = signup;
export const ResetPassword: VueClass<IResetPassword> = resetPassword;
export const ForgotPassword: VueClass<IForgotPassword> = forgotPassword;
export const AuthStore = authStore;
export const client = axiosClient;

export default {
  SignIn,
  SignUp,
  ResetPassword,
  ForgotPassword,
  AuthStore,
  client,
  middlewares
}
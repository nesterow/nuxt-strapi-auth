import {provideVuex, consume} from 'provide-consume-decorator';
import {Module, VuexModule, Mutation, Action} from 'vuex-module-decorators';
import config from './config';

import {AxiosInstance} from 'axios';
import {
  ApiError, 
  LoginAction, 
  RegisterAction, 
  SetCookieAction, 
  ResetPasswordAction, 
  ForgotPasswordAction
} from './types';



enum ApiEndpoints {
  login = 'auth/local',
  register = 'auth/local/register',
  resetPassword = 'auth/reset-password',
  forgotPassword = 'auth/forgot-password',
  usersMe = '/users/me'
};

@Module({
  name: 'auth',
  namespaced: true,
  stateFactory: true
})
@provideVuex(config.store.auth)
export default class AuthStore extends VuexModule {
  
  /**
   * Dependencies
   */
  @consume('cookies') cookie!: Cookies.CookiesStatic;
  @consume('axios')  api!: AxiosInstance; 

  /**
   * State
   */
  user: any = null;
  error: ApiError|boolean = false;
  isLoading: boolean = false;

  /**
   * Mutations
   */
  @Mutation
  setUser(user: any) {
    this.user = user;
  }
  @Mutation
  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }
  @Mutation
  setError(error: ApiError|boolean) {
    this.error = error;
  }

  /**
   * getters
   */
  get errorMessages() {
    if (typeof this.error === 'boolean')
      return;
    const message = this.error.message;
    if (Array.isArray(message)) {
      const messages: any[] = []
      message.map((m) => {
        if (typeof m === 'string') {
          messages.push(m)
        }
        if(Array.isArray(m.messages)) {
          m.messages.map((msg: any) => {
            messages.push(msg.message || msg.id || msg)
          })
        }
      })
      return messages
    } 
    return
  }
  get cookies() {
    return {
      user: this.cookie.get('user'),
      jwt: this.cookie.get('jwt')
    };
  }

  /**
   * Actions
   */
  @Action
  setCookie({key, value}: SetCookieAction) {
    this.cookie.set(key, value);
  }
  @Action
  async login({identifier, password}: LoginAction) {
    try {
      this.setError(false)
      this.setIsLoading(true)
      const res = await this.api.post(ApiEndpoints.login, {identifier, password})
      this.setUser(res.data.user)
      this.setIsLoading(false)
      this.setCookie({key: 'user', value: res.data.user})
      this.setCookie({key: 'jwt', value: res.data.jwt})
    }
    catch (e) {
      const data = e.response && e.response.data;
      this.setIsLoading(false)
      this.setError(data)
    }
  }
  @Action
  async register({email, password, username}: RegisterAction) {
    try {
      this.setError(false)
      this.setIsLoading(true)
      const res = await this.api.post(ApiEndpoints.register, {username, email, password})
      this.setUser(res.data.user)
      this.setIsLoading(false)
      this.setCookie({key: 'user', value: res.data.user})
      this.setCookie({key: 'jwt', value: res.data.jwt})
    }
    catch(e) {
      const data = e.response && e.response.data;
      this.setIsLoading(false)
      this.setError(data)
    }
  }
  @Action
  async sendRestoreLink({email, url}: ForgotPasswordAction) {
    try {
      this.setError(false)
      this.setIsLoading(true)
      const res = await this.api.post(ApiEndpoints.forgotPassword, {email, url})
      this.setIsLoading(false)
    }
    catch (e) {
      const data = e.response && e.response.data;
      this.setIsLoading(false)
      this.setError(data)
    }
  }
  @Action
  async resetPassword({code, password, passwordConfirmation}: ResetPasswordAction) {
    try {
      this.setError(false)
      this.setIsLoading(true)
      const res = await this.api.post(ApiEndpoints.resetPassword, {code, password, passwordConfirmation})
      this.setIsLoading(false)
    }
    catch (e) {
      const data = e.response && e.response.data;
      this.setIsLoading(false)
      this.setError(data)
    }
  }
  @Action
  async getProfile() {
    if (!this.user) {
      return null;
    }
    try {
      this.setError(false)
      this.setIsLoading(true)
      const res = await this.api.get(ApiEndpoints.usersMe)
      this.setUser(res.data)
      this.setIsLoading(false)
    }
    catch(e) {
      const data = e.response && e.response.data;
      this.setIsLoading(false)
      this.setError(data)
    }
  }

  /**
   * Server init action
   */
  @Action
  async serverInit(req: any) {
    const parser = require('cookieparser');
    if (req && req.headers && req.headers.cookie) {
      const cookie = parser.parse(req.headers.cookie)
      this.setUser(cookie.user ? JSON.parse(cookie.user) : null);
    }
  }

}
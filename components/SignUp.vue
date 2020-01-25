<template>
  <section class="SignUp__wrapper">
    <div class="SignUp__form">
      <div>
        <!-- logo -->
      </div>
      <b-field 
        :message="errors.username" 
        :type="fieldType('username')" 
        :label="usernameLabel" 
        :aria-label="usernameLabel">
          <b-input 
              :placeholder="usernamePlaceholder"
              :disabled="isLoading"
              v-model.trim="username"
              type="text"
              icon="account">
          </b-input>
      </b-field>
      <b-field 
        :message="errors.email" 
        :type="fieldType('email')" 
        :label="emailLabel" 
        :aria-label="emailLabel">
          <b-input 
              :placeholder="emailPlaceholder"
              :disabled="isLoading"
              v-model.trim="email"
              type="text"
              icon="email">
          </b-input>
      </b-field>
      <b-field 
        :message="errors.password" 
        :type="fieldType('password')" 
        :label="passwordLabel" 
        :aria-label="passwordLabel">
          <b-input 
              :placeholder="passwordPlaceholder"
              :disabled="isLoading"
              v-model.trim="password"
              type="password"
              icon="lock">
          </b-input>
      </b-field>
      <b-field 
        :message="errors.rePassword" 
        :type="fieldType('rePassword')" 
        :label="rePasswordLabel" 
        :aria-label="rePasswordLabel">
          <b-input 
              :placeholder="rePasswordPlaceholder"
              :disabled="isLoading"
              v-model.trim="rePassword"
              type="password"
              icon="lock"
              @keyup.native.enter="register">
          </b-input>
      </b-field>
      <div>
        <b-button @click.native="register" type="is-primary" :loading="isLoading" expanded>
          {{$t('Sign Up')}}
        </b-button>
        <nuxt-link :to="localePath(signInURL)">
          {{$t('Already have an account?')}}
        </nuxt-link>
      </div>
      <section class="SignUp__notifications">
        <b-notification
          v-for="(message, index) in serverErrors"
          :key="index"
          :duration="4000 + (index * 450)"
          type="is-danger"
          has-icon
          aria-close-label="Close notification"
          role="alert"
          auto-close>
          {{message}}
        </b-notification>
      </section>
    </div>
  </section>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue
} from "nuxt-property-decorator"
import AuthStore from '../store'
import {ISignUp} from './types';
import {provide, consume} from 'provide-consume-decorator';
import {getModule} from 'vuex-module-decorators';

@Component
@provide({
  datastore() {
    return getModule(AuthStore, this.$store)
  }
})
export default class extends Vue implements ISignUp {
  
  @consume('datastore') ds!: AuthStore;
  
  // data
  email: string = '';
  password: string = '';
  rePassword: string = '';
  username: string = '';
  errors = {
    email: '',
    password: '',
    rePassword: '',
    username: ''
  };
  

  // computed
  get signInURL() {
    return 'auth-signin';
  }
  get isLoading() {
    return this.ds.isLoading;
  }
  get isValid() {
    return !this.errors.password   &&
           !this.errors.rePassword &&
           !this.errors.email      && 
           !this.errors.username;
  }
  get invalidEmailMsg() {
    return this.$t('Please enter a valid email address.') as string;
  }
  get userAlreadyExistsMsg() {
    return this.$t('Email is already taken.')  as string;
  }
  get passwordWrongLenMsg() {
    return this.$t('Password must be at least 6 symbols long.')  as string;
  }
  get passwordWrongSymbolsMsg() {
    return this.$t('Password must contain at least one digit.')  as string;
  }
  get passwordsDontMatchMsg() {
    return this.$t("Passwords don't match.")  as string;
  }
  get usernameWrongLenMsg() {
    return this.$t('Username must be at least 2 symbols long.') as string;
  }
  get emailPlaceholder() {
    return this.$t('Email')  as string;
  }
  get passwordPlaceholder() {
    return this.$t('Password')  as string
  }
  get rePasswordPlaceholder() {
    return this.$t('Repeat password')  as string
  }
  get usernamePlaceholder() {
    return this.$t('Name')  as string
  }
  get emailLabel() {
    return ''
  }
  get passwordLabel() {
    return '';
  }
  get rePasswordLabel() {
    return '';
  }
  get usernameLabel() {
    return '';
  }
  get serverErrors() {
    return (this.ds.errorMessages||[]).map((m: string) => {
      return this.$t(m) as string;
    });
  }

  // methods
  /**
   * Validate email/password
   */
  validateInput(): void {
    this.errors = {
      email: '',
      password: '',
      username: '',
      rePassword: ''
    };
    const username = this.username;
    if (username.length < 2) {
      this.errors.username = this.usernameWrongLenMsg as any;
    }
    const email = this.email;
    const emailRe = /\S+@\S+\.\S+/;
    if (!emailRe.test(email) || email.length < 4) {
      this.errors.email = this.invalidEmailMsg as any;
    }
    const password = this.password;
    const passwordRe = /.*[0-9].*/;
    if (password.length < 6) {
      this.errors.password = this.passwordWrongLenMsg as any;
    }
    if (!passwordRe.test(password)) {
      this.errors.password = this.passwordWrongSymbolsMsg as any;
    }
    if (this.rePassword !== this.password) {
      this.errors.rePassword = this.passwordsDontMatchMsg as any;
    }
  }

  /**
   * Get class name for a field
   * @prop name: string
   */
  fieldType(fieldName: string): string|undefined {
    return (this.errors as any)[fieldName] ? 'is-danger' : undefined;
  }

  /**
   * Try to sign in
   */
  async register(): Promise<any> {
    this.validateInput();
    if (!this.isValid) {
      return;
    }
    try 
    {
      const {email, password, username} = this;
      await this.ds.register({
        email,
        password,
        username
      })
      if (!this.ds.error) {
        this.onRegisterSuccess();
      }
    }
    catch (e) 
    {
      console.error(e)
    }

  }

  /**
   * Check email
   */
  async checkEmail(): Promise<any> {
    throw new Error('not implemented');
  }

  /**
   * When registration suceess
   * @override
   */
  onRegisterSuccess() {

  }

}
</script>

<style lang="scss" scoped>
$width: 400px;

.SignUp {
  &__wrapper {
    display: flex;
    align-content: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
  } 
  &__form {
    width: 100%;
    max-width: $width;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  &__notifications {
    position: absolute;
    bottom: 0;
    max-width: $width;
    width: 100%;
  }
}
</style>
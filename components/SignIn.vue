<template>
  <section class="SignIn__wrapper">
    <div class="SignIn__form">
      <div>
        <!-- logo -->
      </div>
      <b-field 
        :message="errors.identifier" 
        :type="fieldType('identifier')" 
        :label="emailLabel" 
        :aria-label="emailLabel">
          <b-input 
              :placeholder="emailPlaceholder"
              :disabled="isLoading"
              v-model.trim="identifier"
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
              icon="lock"
              @keyup.native.enter="login">
          </b-input>
      </b-field>
      <div>
        <b-button @click.native="login" type="is-primary" :loading="isLoading" expanded>
          {{$t('Sign In')}}
        </b-button>
        <nuxt-link :to="localePath(signUpURL)">
          {{$t("Don't have an account?")}}
        </nuxt-link>
        <nuxt-link class="SignIn__forgot-password" v-if="attempts > 1" :to="localePath(forgotPasswordURL)">
          {{$t("Forgot password?")}}
        </nuxt-link>
      </div>
      <section class="SignIn__notifications">
        <b-notification
          v-for="(message, index) in serverErrors"
          :key="index"
          :duration="4000 + (index * 450)"
          type="is-danger"
          has-icon
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
import {ISignIn} from './types';
import {provide, consume} from 'provide-consume-decorator';
import {getModule} from 'vuex-module-decorators';

@Component
@provide({
  datastore() {
    return getModule(AuthStore, this.$store)
  }
})
export default class extends Vue implements ISignIn {
  
  @consume('datastore') ds!: AuthStore;
  
  // data
  identifier: string = '';
  password: string = '';
  errors = {
    identifier: '',
    password: ''
  };
  attempts: number = 0;
  

  // computed
  get signUpURL() {
    return 'auth-signup';
  }
  get forgotPasswordURL() {
    return 'auth-forgot-password';
  }
  get isLoading() {
    return this.ds.isLoading;
  }
  get isValid() {
    return !!!this.errors.password && !!!this.errors.identifier;
  }
  get invalidEmailMsg() {
    return this.$t('Please enter a valid email address.') as string;
  }
  get passwordWrongLenMsg() {
    return this.$t('Password must be at least 6 symbols long.') as string;
  }
  get passwordWrongSymbolsMsg() {
    return this.$t('Password must contain at least one digit.') as string;
  }
  get emailPlaceholder() {
    return this.$t('Email') as string;
  }
  get passwordPlaceholder() {
    return this.$t('Password') as string;
  }
  get emailLabel() {
    return ''
  }
  get passwordLabel() {
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
      identifier: '',
      password: ''
    };
    const email = this.identifier;
    const emailRe = /\S+@\S+\.\S+/;
    if (!emailRe.test(email) || email.length < 4) {
      this.errors.identifier = this.invalidEmailMsg;
    }
    const password = this.password;
    const passwordRe = /.*[0-9].*/;
    if (password.length < 6) {
      this.errors.password = this.passwordWrongLenMsg;
    }
    if (!passwordRe.test(password)) {
      this.errors.password = this.passwordWrongSymbolsMsg;
    }
  }

  /**
   * Get class name for a field
   * @prop name: string
   */
  fieldType(fieldName: string): string|undefined {
    return !!(this.errors as any)[fieldName] ? 'is-danger' : undefined;
  }

  /**
   * Try to sign in
   */
  async login(): Promise<any> {
    this.validateInput();
    if (!this.isValid) {
      return;
    }
    try 
    {
      const {identifier, password} = this;
      await this.ds.login({
        identifier,
        password
      })
      if (!this.ds.error) {
        this.onLoginSuccess();
      } 
      else {
        this.attempts++;
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
   * When login success
   * @override
   */
  onLoginSuccess() {

  }

}
</script>

<style lang="scss" scoped>
$width: 400px;

.SignIn {
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
  &__forgot-password {
    display: block;
    margin-top: 48px;
    text-align: center;
    font-size: 16px;
  }
}
</style>
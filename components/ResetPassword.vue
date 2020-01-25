<template>
  <section class="RestetPassword__wrapper">
    <div class="RestetPassword__form">
      <div>
        <!-- logo -->
      </div>
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
              @keyup.native.enter="send">
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
              icon="lock">
          </b-input>
      </b-field>
      <div>
        <b-button @click.native="send" type="is-primary" :loading="isLoading" expanded>
          {{$t('Reset password')}}
        </b-button>
        <nuxt-link :to="localePath(signInURL)">
          {{$t('Already have an account?')}}
        </nuxt-link>
      </div>
      <section class="RestetPassword__notifications">
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
import {IResetPassword} from './types';
import {provide, consume} from 'provide-consume-decorator';
import {getModule} from 'vuex-module-decorators';

@Component
@provide({
  datastore() {
    return getModule(AuthStore, this.$store)
  }
})
export default class extends Vue implements IResetPassword {
  
  @consume('datastore') ds!: AuthStore;

  created() {
    const {id} = this.$route.params;
    this.token = id;
  }

  // data
  token: string = '';
  password: string = '';
  rePassword: string = '';
  errors = {
    token: '',
    password: '',
    rePassword: '',
  };
  

  // computed
  get isLoading() {
    return this.ds.isLoading;
  }
  get isValid() {
    return !this.errors.password   &&
           !this.errors.rePassword &&
           !this.errors.token       ;
  }

  get signInURL() {
    return 'auth-signin';
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
  get linkIsNotvalidMsg() {
    return this.$t("Restore link is not valid.")  as string;
  }
  get passwordPlaceholder() {
    return this.$t('Password')  as string
  }
  get rePasswordPlaceholder() {
    return this.$t('Repeat password')  as string
  }
  get passwordLabel() {
    return '';
  }
  get rePasswordLabel() {
    return '';
  }
  get serverErrors() {
    return (this.ds.errorMessages||[]).map((m: string) => {
      return this.$t(m) as string;
    });
  }

  // methods
  /**
   * Validate token/password
   */
  validateInput(): void {
    this.errors = {
      token: '',
      password: '',
      rePassword: ''
    };
    const token = this.token;
    if (!token) {
      this.errors.token = this.linkIsNotvalidMsg as any;
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
  async send(): Promise<any> {
    this.validateInput();
    if (!this.isValid) {
      return;
    }
    try 
    {
      const {password, rePassword, token} = this;
      await this.ds.resetPassword({
        code: token,
        passwordConfirmation: rePassword,
        password,
      })
      if (!this.ds.error) {
        this.onSendSuccess();
      }
    }
    catch (e) 
    {
      console.error(e)
    }

  }

  /**
   * When registration suceess
   * @override
   */
  onSendSuccess() {

  }

}
</script>

<style lang="scss" scoped>
$width: 400px;

.RestetPassword {
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
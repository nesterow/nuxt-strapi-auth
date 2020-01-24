<template>
  <section class="ForgotPassword__wrapper">
    <div class="ForgotPassword__form" v-if="!isSent">
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
              icon="email"
              @keyup.native.enter="send">
          </b-input>
      </b-field>
      <div>
        <b-button @click.native="send" type="is-primary" :loading="isLoading" expanded>
          {{$t('Email reset link')}}
        </b-button>
        <nuxt-link :to="localePath(signInURL)">
          {{$t("Sign In")}}
        </nuxt-link>
      </div>
    
    </div>
    <div v-else class="ForgotPassword__isSent">
      <h2>
        {{$t('Password reset link is sent to {email}', {email: identifier})}}
      </h2>
    </div>
    <section class="ForgotPassword__notifications">
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
  </section>
</template>

<script lang="ts">
import {
  Component,
  Vue
} from "nuxt-property-decorator";
import AuthStore from '../store';
import {IForgotPassword} from './types';
import {provide, consume} from 'provide-consume-decorator';
import {getModule} from 'vuex-module-decorators';


@Component
@provide({
  datastore() {
    return getModule(AuthStore, this.$store)
  }
})
export default class extends Vue implements IForgotPassword {
  
  @consume('datastore') ds!: AuthStore;
  
  // data
  identifier: string = '';
  errors = {
    identifier: ''
  };
  isSent: boolean = false;

  
  // computed
  get signInURL() {
    return 'auth-signin';
  }
  get isLoading() {
    return this.ds.isLoading;
  }
  get isValid() {
    return !!!this.errors.identifier;
  }
  get invalidEmailMsg() {
    return this.$t('Please enter a valid email address.') as string;
  }
  get emailPlaceholder() {
    return this.$t('Email') as string;
  }
  get emailLabel() {
    return ''
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
    };
    const email = this.identifier;
    const emailRe = /\S+@\S+\.\S+/;
    if (!emailRe.test(email) || email.length < 4) {
      this.errors.identifier = this.invalidEmailMsg as string;
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
  async send(): Promise<any> {
    this.validateInput();
    if (!this.isValid) {
      return;
    }
    try 
    {
      const {identifier} = this;
      await this.ds.sendRestoreLink({ 
        email: identifier,
        url: (window.location.href).replace('forgot-password', 'reset-password') 
      })
      if (!this.ds.error) {
        this.onSendSuccess();
      }
      this.isSent = true;
    }
    catch (e) 
    {
      console.error(e)
    }

  }

  /**
   * When login success
   * @override
   */
  onSendSuccess() {

  }

}
</script>

<style lang="scss" scoped>
$width: 400px;

.ForgotPassword {
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
  &__isSent {
    width: 100%;
    max-width: $width;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: opacity 1s;
  }
}
</style>
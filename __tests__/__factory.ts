
import Vuex from 'vuex';
import {createLocalVue, mount, config, VueClass} from '@vue/test-utils';
import {Store} from './__mocks';
import { Vue, Component } from "nuxt-property-decorator";
import {provide} from 'provide-consume-decorator';
import { getModule } from 'vuex-module-decorators';

console.error = () => {};

export default (VueComponent: VueClass<Vue>, props?: any, attrs?: any) => {
  const localVue = createLocalVue()
  localVue.prototype.$t = (a: any) => a;
  localVue.prototype.localePath = () => '';
  localVue.use(Vuex)
  
  @Component
  @provide({
    datastore() {
      return getModule(Store, this.$store)
    }
  })
  class C extends VueComponent {}

  const store = new Vuex.Store({
    modules: {
      'auth': Store
    }
  })
  return mount(C, {
    props,
    attrs,
    store,
    localVue
  })
}
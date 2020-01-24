import Vuex from 'vuex';
import {createLocalVue, mount, config, VueClass} from '@vue/test-utils';
import AuthStore from '../store';
import { Vue } from "nuxt-property-decorator";
console.error = () => {};
export default (VueComponent: VueClass<Vue>, props?: any, attrs?: any) => {
  const localVue = createLocalVue()
  localVue.prototype.$t = (a: any) => a;
  localVue.use(Vuex)
  const store = new Vuex.Store({
    modules: {
      'auth': AuthStore
    }
  })
  return mount(VueComponent, {
    props,
    attrs,
    store,
    localVue
  })
}
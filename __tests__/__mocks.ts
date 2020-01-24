import {provideVuex} from 'provide-consume-decorator'
import AuthStore from '../store'
import conf from '../config/testing'

@provideVuex(conf.store.auth)
export class Store extends AuthStore {

}
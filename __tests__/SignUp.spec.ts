import factory from './__factory'

//@ts-ignore
import SignUp from '../components/SignUp.vue';
import {ISignUp} from '../components/types';

const createComponent = () => {

  const component = factory(SignUp)
  
  const props = {
  }

  const data = {

  }

  component.setProps(props)
  component.setData(data)
  return component

}

describe("SignUp.vue", () => {
  it('mounts with store', () => {
    const wrap = createComponent()
    expect(wrap.vm).toBeInstanceOf(Object)
    expect((wrap.vm as any).ds).toBeInstanceOf(Object)
  });
  it('validateInput()', () => {
    const wrap = createComponent();
    const vm = wrap.vm as Vue & ISignUp;
    //email
    wrap.setData({
      identifier: 'Email'
    });
    vm.validateInput()
    expect(vm.errors.email).toBe(vm.invalidEmailMsg);

    wrap.setData({
      email: 'bob@bob.com'
    });
    vm.validateInput()
    expect(vm.errors.email).toBe('')
    //password
    expect(vm.errors.password).toBe(vm.passwordWrongSymbolsMsg)
    wrap.setData({
      password:'qw1qw'
    })
    vm.validateInput()
    expect(vm.errors.password).toBe(vm.passwordWrongLenMsg)
    wrap.setData({
      password:'qweqwe'
    })
    vm.validateInput()
    expect(vm.errors.password).toBe(vm.passwordWrongSymbolsMsg)
    wrap.setData({
      password:'qweqw2e'
    })
    vm.validateInput()
    expect(vm.errors.password).toBe('')
    expect(vm.errors.rePassword).toBe(vm.passwordsDontMatchMsg)
  });
})
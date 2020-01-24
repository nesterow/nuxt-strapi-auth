import factory from './__factory'

//@ts-ignore
import SignIn from '../components/SignIn.vue';
import {ISignIn} from '../components/types';

const createComponent = () => {

  const component = factory(SignIn)
  
  const props = {
  }

  const data = {

  }

  component.setProps(props)
  component.setData(data)
  return component

}

describe("SignIn.vue", () => {
  it('mounts with store', () => {
    const wrap = createComponent()
    expect(wrap.vm).toBeInstanceOf(Object)
    expect((wrap.vm as any).ds).toBeInstanceOf(Object)
  });
  it('validateInput()', () => {
    const wrap = createComponent();
    const vm = wrap.vm as Vue & ISignIn;
    //email
    wrap.setData({
      identifier: 'Email'
    });
    vm.validateInput()
    expect(vm.errors.identifier).toBe(vm.invalidEmailMsg);

    wrap.setData({
      identifier: 'bob@bob.com'
    });
    vm.validateInput()
    expect(vm.errors.identifier).toBe('')
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
  });
})
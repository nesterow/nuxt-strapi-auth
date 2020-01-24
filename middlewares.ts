/**
 * View is only for NOT authenticated
 */
export function notAuthenticated({app, store, redirect} : any) {
  const {auth} = store.state;
    if (auth.user) {
      redirect(app.localePath('index'))
    }
}

/**
 * View is only for authenticated
 */
export function authenticated({app, store, redirect} : any) {
  const {auth} = store.state;
    if (!auth.user) {
      redirect(app.localePath('auth-signin'))
    }
}
/**
 * View is authorized for 'role'
 * @param role : string
 */
export function authorized(role: string) {
  return function ({app, store, redirect} : any) {
    const {auth} = store.state;
      if (!auth.user) {
        redirect(app.localePath('signin'))
      }
      if (auth.user.role.name !== role) {
        redirect(app.localePath('signin'))
      }
  }
}

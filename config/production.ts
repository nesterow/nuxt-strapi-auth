import Cookies from 'js-cookie';

export default {
  app: { /* additional app config, goes to index.vue */ },
  store: {
    auth: {
      cookies: () => Cookies
    }
  },
}
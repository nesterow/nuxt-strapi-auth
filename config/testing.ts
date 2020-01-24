import axios from 'axios';
import Cookies from './__mocks__/cookies.mock';

export default {
  app: { /* additional app config, goes to index.vue */ },
  store: {
    auth: {
      axios() {
        const service = axios.create({
          baseURL: process.env.API_URL || 'http://localhost:1337/',
        });
        service.interceptors.request.use(
          config => {
            // Do something before request is sent
            const jwt = (this as any).cookie.get('jwt');
            if (jwt) config.headers["Authorization"] = "Bearer " + jwt;
            return config;
          },
          error => {
            Promise.reject(error);
          }
        );
        return service
      },
      cookies: () => Cookies()
    }
  },
}
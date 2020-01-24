import axios, { AxiosInstance } from 'axios';

type ClientFactoryProps = {
  cookie: any,
  apiURL?: string;
}

export default ({ cookie, apiURL = 'http://localhost:1337/' }: ClientFactoryProps): AxiosInstance => {
  const service = axios.create({
    baseURL: process.env.API_URL || apiURL,
  });
  service.interceptors.request.use(
    config => {
      const jwt = cookie.get('jwt');
      if (jwt) config.headers["Authorization"] = "Bearer " + jwt;
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
  return service
}
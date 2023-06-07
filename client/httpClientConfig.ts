import axios, { AxiosRequestConfig } from 'axios';

interface RetryConfig extends AxiosRequestConfig {
  retry: number;
  retryDelay: number;
}

const retryConfig: RetryConfig = {
  retry: 3,
  retryDelay: 1000,
};

// TODO: pass default config values such as url, timeout etc
const getHtpClientConfig = () => {
  const client = axios.create({
    baseURL: 'http://localhost:3001',
  });

  client.interceptors.response.use(
    (response: any) => response,
    (err: any) => {
      const { config } = err;

      // TODO: figure out what error do we want to retry

      if (!config || !config.retry) {
        return Promise.reject(err);
      }

      config.retry -= 1;

      const delayRetryRequest = new Promise<void>((resolve) => {
        setTimeout(() => {
          console.log('Retring the request', config.url);
          resolve();
        }, config.retryDelay || 1000);
      });

      return delayRetryRequest.then(() => client(config));
    }
  );

  return client;
};

export { retryConfig };
export default getHtpClientConfig;

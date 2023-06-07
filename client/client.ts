import { AxiosInstance } from 'axios';
import getHtpClientConfig, { retryConfig } from './httpClientConfig';

interface UsagePerCustomer {
  customer_id: string;
  service: string;
  units_consumed: number;
  price_per_unit: number;
}

/*
TODO: Design client as a singleton class to ensure that only one instance of the class exists at any given time
*/
class Client {
  httpClient: AxiosInstance;
  
  constructor() {
    this.httpClient = getHtpClientConfig();
  }

  async createCustomer(name: string) {
    try {
      const response = await this.httpClient.post(
        '/api/v1/customers',
        {
          customer_name: name,
        },
        retryConfig
      );
      return response.data.customer;
    } catch (error: any) {
      // check for types of errors and raise accordingly
      throw new Error(`Client error: ${error.message}`);
    }
  }

  async createUsage(payload: UsagePerCustomer) {
    try {
      const customerId = payload.customer_id;

      const response = await this.httpClient.post(
        `/api/v1/customers/${customerId}/usage`,
        {
          service: payload.service,
          units_consumed: payload.units_consumed,
          price_per_unit: payload.price_per_unit,
        },
        retryConfig
      );
      return response.data.usage;
    } catch (error: any) {
      // check for types of errors and raise accordingly
      throw new Error(`Client error: ${error.message}`);
    }
  }
}

export default Client;

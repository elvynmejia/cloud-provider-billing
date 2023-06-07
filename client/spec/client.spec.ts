import chai from 'chai';
import Client from '../client';

const { expect } = chai;

describe('Client', () => {
  context('createCustomer', () => {
    it('creates a customer', async () => {
      const client = new Client();
      const response = await client.createCustomer('a test customer');
      expect(response.name).to.eq('a test customer');
    });
  });

  context('createUsage', () => {
    it('creates a usage record given a customer id', async () => {
      const client = new Client();
      
      const customer = await client.createCustomer('usage customer');

      const usage = {
        service: 'Database Hosting',
        units_consumed: 58,
        price_per_unit: 0.05
      };

      const customerId = customer.id;

      const response = await client.createUsage({
        customer_id: customerId,
        ...usage,
      });

      expect(response.customer_id).to.eq(customerId);
      expect(response.service).to.eq('Database Hosting');
      expect(response.units_consumed).to.eq(58);
      expect(response.price_per_unit).to.eq(0.05);

      expect(
        Object.keys(response)
      ).to.have.members([
        'id',
        'customer_id',
        'service',
        'units_consumed',
        'price_per_unit'
      ]);
    });
  });
});
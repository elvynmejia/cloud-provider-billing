import chai from 'chai';

import client from '../../../index';

import {
  createCustomer,
  findLastCreatedUsageByCustomerId,
} from '../../../../app/models';

const { expect } = chai;

describe('customer API', () => {
  context('POST /api/v1/customers/:id/usage', () => {
    it('creates a new usage record given a customer', async () => {
      const customer = await createCustomer('test_customer');
      const customerId = customer._id.toString();

      const usage = {
        service: 'Database Hosting',
        units_consumed: 58,
        price_per_unit: 0.05,
      };

      const response = await client
        .post(`/api/v1/customers/${customerId}/usage`)
        .send(usage);

      expect(response.status).to.eq(201);

      const lastCreatedUsage = await findLastCreatedUsageByCustomerId(
        customerId
      );

      expect(response.body.usage).to.deep.eq({
        id: lastCreatedUsage[0]._id.toString(),
        customer_id: lastCreatedUsage[0].customer_id,
        ...usage,
      });

      expect(Object.keys(response.body.usage)).to.have.members([
        'id',
        'customer_id',
        'service',
        'units_consumed',
        'price_per_unit',
      ]);
    });
  });

  context('POST /api/v1/customers', () => {
    it('creates a stand-alone customer record', async () => {
      const response = await client.post('/api/v1/customers').send({
        customer_name: 'a test customer',
      });

      expect(response.status).to.eq(201);
      expect(response.body.customer.name).to.eq('a test customer');

      expect(Object.keys(response.body.customer)).to.have.members([
        'id',
        'name',
      ]);
    });
  });
});

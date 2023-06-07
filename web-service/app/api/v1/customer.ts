import { Response, NextFunction, Router } from 'express';

const router = Router();

import { createUsagePerCustomer, createCustomer } from '../../models';

router.post(
  '/api/v1/customers',
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const customerName = req.body.customer_name;

      const customer = await createCustomer(customerName);

      res.status(201).json({
        customer: {
          id: customer._id.toString(),
          name: customer.name,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        errors: [],
        messge: `Something went wrong: ${error.message}.`
      });
    }
  }
);

router.post(
  '/api/v1/customers/:id/usage',
  async (req: any, res: Response, next: NextFunction) => {
    try {
      /*
    TODO:
    1. validate that customer exists before moving forward. Return 404 for customer not found
    2. validate service, units_consumed, price_per_unit that they are present and contain proper or allowed values
    */
      const customerId = req.params.id;

      const { body } = req;

      const usage = await createUsagePerCustomer({
        customer_id: customerId,
        service: body.service,
        units_consumed: body.units_consumed,
        price_per_unit: body.price_per_unit,
      });

      res.status(201).json({
        usage: {
          id: usage._id.toString(),
          customer_id: usage.customer_id,
          service: usage.service,
          units_consumed: usage.units_consumed,
          price_per_unit: usage.price_per_unit,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        errors: [],
        messge: `Something went wrong: ${error.message}.`
      });
    }
  }
);

export default router;

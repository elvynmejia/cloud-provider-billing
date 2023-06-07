import mongoose from 'mongoose';

// TODO: add time stamps and other relevant metadata
// TODO: handle Mongoose errors

const customerSchema = new mongoose.Schema({
  name: String
});

interface UsagePerCustomer {
  customer_id: string;
  service: string;
  units_consumed: number;
  price_per_unit: number;
}

const usageSchema = new mongoose.Schema({
  customer_id: String, // make sure to cast Customer id to a string
  service: String,
  units_consumed: Number, // make sure these values are float/double
  price_per_unit: Number
});
  
const Customer = mongoose.model('Customer', customerSchema);
const Usage = mongoose.model('Usage', usageSchema);

const createCustomer = async (name: string) => {
  const customer = new Customer({ name });
  return await customer.save();
};

const createUsagePerCustomer =  async (payload: UsagePerCustomer) => {
  const usage = new Usage({
    customer_id: payload.customer_id,
    service: payload.service,
    units_consumed: payload.units_consumed,
    price_per_unit: payload.price_per_unit 
  });

  return await usage.save();
};

const findUsageById = async (id: string) => {
  return await Usage.find(
    new mongoose.Types.ObjectId(id)
  );
};

const findLastCreatedUsageByCustomerId = async (customerId: string) => {
  return await Usage.find({ customer_id: customerId }).sort({_id: 1 }).limit(1);
};

export {
  Customer,
  Usage,
  findUsageById,
  createCustomer,
  createUsagePerCustomer,
  findLastCreatedUsageByCustomerId
};
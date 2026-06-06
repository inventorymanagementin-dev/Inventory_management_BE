const mongoose = require('mongoose');
const Product = require('./models/Product');
const { createProduct } = require('./validations/productValidation');
require('dotenv').config();

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  try {
    const payload = {
      name: 'Test',
      sku: 'TEST-123',
      category_id: '60d5ecb00000000000000000',
      supplier_id: '60d5ecb00000000000000000',
      unit_price: 100,
      quantity_in_stock: 10,
      reorder_level: 5
    };
    await Product.create(payload);
    console.log('Success');
  } catch (err) {
    console.log('ERROR:', err);
  }
  process.exit(0);
}
test();

const Joi = require('joi');

const productValidation = {
  createProduct: Joi.object({
    name: Joi.string().max(150).required(),
    sku: Joi.string().required(),
    category_id: Joi.string().required(),
    supplier_id: Joi.string().required(),
    unit_price: Joi.number().min(0).required(),
    quantity_in_stock: Joi.number().min(0).required(),
    reorder_level: Joi.number().min(0).required(),
    status: Joi.string().valid('In Stock', 'Low Stock', 'Out of Stock')
  }),

  updateProduct: Joi.object({
    name: Joi.string().max(150),
    sku: Joi.string(),
    category_id: Joi.string(),
    supplier_id: Joi.string(),
    unit_price: Joi.number().min(0),
    quantity_in_stock: Joi.number().min(0),
    reorder_level: Joi.number().min(0),
    status: Joi.string().valid('In Stock', 'Low Stock', 'Out of Stock')
  })
};

module.exports = productValidation;

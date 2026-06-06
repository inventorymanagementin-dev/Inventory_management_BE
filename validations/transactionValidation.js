const Joi = require('joi');

const transactionValidation = {
  stockIn: Joi.object({
    product_id: Joi.string().required(),
    quantity: Joi.number().min(1).required(),
    reference: Joi.string().allow('', null),
    notes: Joi.string().allow('', null)
  }),
  
  stockOut: Joi.object({
    product_id: Joi.string().required(),
    quantity: Joi.number().min(1).required().messages({
      'number.min': 'Quantity to remove must be at least 1',
    }),
    reference: Joi.string().allow('', null),
    notes: Joi.string().allow('', null)
  })
};

module.exports = transactionValidation;

const Joi = require('joi');

const supplierValidation = {
  createSupplier: Joi.object({
    name: Joi.string().max(100).required(),
    email: Joi.string().email().required().messages({
      'string.email': 'Must be a valid email format'
    }),
    phone: Joi.string().max(20).required().pattern(/^[0-9\+\-\s\(\)]+$/).messages({
      'string.pattern.base': 'Phone must contain valid characters'
    }),
    address: Joi.string().required(),
    status: Joi.string().valid('Active', 'Inactive')
  }),

  updateSupplier: Joi.object({
    name: Joi.string().max(100),
    email: Joi.string().email(),
    phone: Joi.string().max(20).pattern(/^[0-9\+\-\s\(\)]+$/),
    address: Joi.string(),
    status: Joi.string().valid('Active', 'Inactive')
  })
};

module.exports = supplierValidation;

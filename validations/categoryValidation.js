const Joi = require('joi');

const categoryValidation = {
  createCategory: Joi.object({
    name: Joi.string().max(50).required().messages({
      'string.empty': 'Name cannot be empty',
      'any.required': 'Name is required'
    }),
    description: Joi.string().max(500).allow('', null),
    status: Joi.string().valid('Active', 'Inactive')
  }),
  
  updateCategory: Joi.object({
    name: Joi.string().max(50),
    description: Joi.string().max(500).allow('', null),
    status: Joi.string().valid('Active', 'Inactive')
  })
};

module.exports = categoryValidation;

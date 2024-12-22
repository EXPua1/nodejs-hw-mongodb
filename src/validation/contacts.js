import Joi from 'joi';

export const contactSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(20)
    .pattern(/^[a-zA-Z]+$/)
    .required()
    .messages({
      'string.base': 'Username should be a string',
      'string.min': 'Username should be at least {#limit} characters long',
      'string.max': 'Username should be at most {#limit} characters long',
      'string.pattern.base': 'Username should only contain letters',
      'any.required': 'Username is required',
    }),
  phoneNumber: Joi.string()
    .pattern(/^(\+380\d{9}|0\d{9})$/)
    .required(),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should be at least {#limit} characters long',
    'string.max': 'Username should be at most {#limit} characters long',
    'any.required': 'Username is required',
  }),
  phoneNumber: Joi.string().pattern(/^(\+380\d{9}|0\d{9})$/),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
});

const Joi = require('@hapi/joi');

const userLoginSchema = Joi.object({
    user_email: Joi.string()
        .email()
        .required(),
    user_password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{5,70}$'))
        .required(),
})

const userRegisterSchema = Joi.object({
    user_name: Joi.string()
        .min(2)
        .max(70)
        .required(),
    user_email: Joi.string()
        .email()
        .required(),
    user_password_1: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{5,70}$'))
        .required(),
    user_password_2: Joi.any()
        .valid(Joi.ref('user_password_1'))
        .required()    
})

module.exports.userLoginSchema = userLoginSchema;
module.exports.userRegisterSchema = userRegisterSchema;
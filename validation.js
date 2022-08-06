const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const complexityOptions = {
  min: 5,
  max: 20,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 0,
  requirementCount: 1,
};

function validateUser(user) {
  const Schema = Joi.object().keys({
    email: Joi.string().email().label("Email").max(50).required(),
    firstname: Joi.string().label("First Name").max(100).required(),
    lastname: Joi.string().label("Last Name").max(100).required(),
    role: Joi.string().label("Role").max(100).required(),
    password: passwordComplexity(complexityOptions)
      .label("Password")
      .required(),
  });

  return Schema.validate(user);
}

function validateLogin(user) {
  const Schema = Joi.object().keys({
    email: Joi.string().email().label("Email").max(50).required(),
    password: passwordComplexity(complexityOptions)
      .label("Password")
      .required(),
  });

  return Schema.validate(user);
}

function validatePassword(user) {
  const Schema = Joi.object().keys({
    password: passwordComplexity(complexityOptions)
      .label("Password")
      .required(),
    confirm_password: passwordComplexity(complexityOptions)
      .label("Confirm Password")
      .required(),
    url: Joi.string().label("Url").max(50).required(),
  });

  return Schema.validate(user);
}


function validateUpdatePassword(user) {
  const Schema = Joi.object().keys({
    password: passwordComplexity(complexityOptions)
      .label("Password")
      .required(),
    confirm_password: passwordComplexity(complexityOptions)
      .label("Confirm Password")
      .required()
  });
  return Schema.validate(user);
}

function validateForgot(user) {
  const Schema = Joi.object().keys({
    email: Joi.string().email().label("Email").max(50).required(),
  });

  return Schema.validate(user);
}

module.exports = {
  validateUser,
  validateLogin,
  validateForgot,
  validatePassword,
  validateUpdatePassword
};

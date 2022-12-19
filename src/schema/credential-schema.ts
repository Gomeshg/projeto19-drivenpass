import joi from "joi";

const credentialSchema = joi.object({
  title: joi.string().required(),
  url: joi.string().uri().required(),
  username: joi.string().required(),
  password: joi.string().required(),
  userId: joi.number().integer().required(),
});

const credentialUpdateSchema = joi.object({
  title: joi.string(),
  url: joi.string().uri(),
  username: joi.string(),
  password: joi.string(),
});

export { credentialSchema, credentialUpdateSchema };

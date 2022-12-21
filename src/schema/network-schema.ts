import joi from "joi";

const networkSchema = joi.object({
  title: joi.string().required(),
  network: joi.string().required(),
  password: joi.string().required(),
  userId: joi.number().integer().required(),
});

const networkUpdatedSchema = joi.object({
  title: joi.string(),
  network: joi.string(),
  password: joi.string(),
});

export { networkSchema, networkUpdatedSchema };

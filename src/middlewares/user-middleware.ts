import { NextFunction, Request, Response } from "express";
import { userSchema } from "../schema/auth-schema.js";
import { UserType } from "../protocols/types.js";
import status from "http-status";

export default function validateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const newUser = req.body as UserType;

  const { error } = userSchema.validate(newUser, { abortEarly: false });
  if (error) {
    return res
      .status(status.BAD_REQUEST)
      .send(error.details.map((item) => item.message));
  } else {
    next();
  }
}

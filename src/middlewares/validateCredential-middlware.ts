import { NextFunction, Request, Response } from "express";
import { credentialSchema } from "../schema/credential-schema.js";
import { CredentialType } from "../protocols/types.js";
import status from "http-status";

export default function validateCredential(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = res.locals.userId as number;
  const newCredential = { ...req.body, userId: userId } as CredentialType;
  const { error } = credentialSchema.validate(newCredential, {
    abortEarly: false,
  });
  if (error) {
    return res
      .status(status.BAD_REQUEST)
      .send(error.details.map((item) => item.message));
  } else {
    next();
  }
}

import { NextFunction, Request, Response } from "express";
// import { credentialUpdateSchema } from "../schema/credential-schema.js";
// import { CredentialUpdateType } from "../protocols/types.js";
import { credentialUpdateSchema } from "../schema/credential-schema";
import { CredentialUpdateType } from "../protocols/types";
import status from "http-status";

export default function validateCredential(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const updateCredential = req.body as CredentialUpdateType;
  const { error } = credentialUpdateSchema.validate(updateCredential, {
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

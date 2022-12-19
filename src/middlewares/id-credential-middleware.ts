import { NextFunction, Request, Response } from "express";
import { CredentialType } from "../protocols/types.js";
import status from "http-status";

export default function validateCredentialID(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const credentialId = Number(req.params.id);
  if (!credentialId) {
    return res.sendStatus(status.BAD_REQUEST);
  }

  res.locals.credentialId = credentialId;
  next();
}

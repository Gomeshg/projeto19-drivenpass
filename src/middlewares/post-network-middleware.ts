import { NextFunction, Request, Response } from "express";
// import { networkSchema } from "../schema/network-schema.js";
// import { NetworkType } from "../protocols/types.js";
import { networkSchema } from "../schema/network-schema";
import { NetworkType } from "../protocols/types";
import status from "http-status";

export default function validateCredential(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = res.locals.userId as number;
  const newNetwork = { ...req.body, userId: userId } as NetworkType;
  const { error } = networkSchema.validate(newNetwork, {
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

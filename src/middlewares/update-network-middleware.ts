import { NextFunction, Request, Response } from "express";
// import { networkUpdateSchema } from "../schema/credential-schema.js";
// import { NetworkUpdateType } from "../protocols/types.js";
import { networkUpdateSchema } from "../schema/network-schema";
import { NetworkUpdateType } from "../protocols/types";
import status from "http-status";

export default function validateNetwork(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const updateNetwork = req.body as NetworkUpdateType;
  const { error } = networkUpdateSchema.validate(updateNetwork, {
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

import { NextFunction, Request, Response } from "express";
import status from "http-status";

export default function validateID(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = Number(req.params.id);
  if (!id) {
    return res.sendStatus(status.BAD_REQUEST);
  }

  res.locals.id = id;
  next();
}

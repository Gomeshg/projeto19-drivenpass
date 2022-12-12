import { NextFunction, Request, Response } from "express";
import sessionRepository from "../repository/session-repository.js";
import { secretKey } from "../protocols/secretKey.js";
import jwt from "jsonwebtoken";
import status from "http-status";

export default async function authToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorization = req.headers?.authorization;
  const token = authorization?.split(" ")[1] as string;

  try {
    const isValidToken = await sessionRepository.searchSession(token);

    if (isValidToken) {
      next();
    } else {
      return res.sendStatus(status.UNAUTHORIZED);
    }
  } catch {
    return res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
}

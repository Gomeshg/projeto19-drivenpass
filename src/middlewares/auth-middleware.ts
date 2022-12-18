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
  const token = authorization?.split(" ")[1];

  if (!token) {
    return res.sendStatus(status.BAD_REQUEST);
  }

  try {
    const thereIsToken = await sessionRepository.searchSession(token);

    if (thereIsToken) {
      const isValidToken = jwt.verify(token, secretKey);

      if (isValidToken) {
        res.locals.userId = thereIsToken.userId;
        next();
      } else {
        return res.sendStatus(status.UNAUTHORIZED);
      }
    } else {
      return res.sendStatus(status.UNAUTHORIZED);
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.sendStatus(status.UNAUTHORIZED);
    }
    return res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
}

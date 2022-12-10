import { Request, Response } from "express";
import userService from "../service/user-service.js";
import { UserType } from "../protocols/types.js";
import status from "http-status";

async function signUp(req: Request, res: Response) {
  const newUser = req.body as UserType;

  try {
    await userService.insertUser(newUser);
    return res.status(201).send("User created sucessfully");
  } catch (error) {
    switch (error.name) {
      // case status["400_NAME"]:
      //   return res.status(status.BAD_REQUEST).send(error.message);
      //   break;

      // case status["401_NAME"]:
      //   return res.status(status.UNAUTHORIZED).send(error.message);
      //   break;

      // case status["404_NAME"]:
      //   return res.status(status.NOT_FOUND).send(error.message);
      //   break;

      case "ConflictError":
        return res.status(status.CONFLICT).send(error.message);
        break;

      default:
        return res.sendStatus(status.INTERNAL_SERVER_ERROR);
    }
  }
}

async function signIn(req: Request, res: Response) {
  return res.status(200).send("Show de bolinhas!");
}

export { signUp, signIn };

// bcrypt.compareSync(password, user.password)

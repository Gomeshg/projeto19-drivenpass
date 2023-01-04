import { Request, Response } from "express";
// import userService from "../service/user-service.js";
// import { UserType } from "../protocols/types.js";
import userService from "../service/user-service";
import { UserType } from "../protocols/types";
import status from "http-status";

async function signUp(req: Request, res: Response) {
  const newUser = req.body as UserType;

  try {
    await userService.insertUser(newUser);
    return res.status(status.CREATED).send("User created sucessfully");
  } catch (error) {
    if (error.name === "ConflictError") {
      return res.status(status.CONFLICT).send(error.message);
    }

    return res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
}

async function signIn(req: Request, res: Response) {
  const user = req.body as UserType;

  try {
    const session = await userService.loginUser(user);

    return res
      .status(status.OK)
      .send({ feedback: "Login efetuado com sucesso!", token: session.token });
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.status(status.UNAUTHORIZED).send(error.message);
    }
    return res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
}

export { signUp, signIn };

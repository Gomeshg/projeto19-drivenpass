import { Router } from "express";
import { signUp, signIn } from "../controller/user-controller.js";
import validateUser from "../middlewares/validateUser-middleware.js";
import authToken from "../middlewares/auth-middleware.js";

const userRouter = Router();

userRouter.post("/sign-up", validateUser, signUp);
userRouter.post("/sign-in", validateUser, signIn);
userRouter.get("/bolinha", authToken, (req, res) => {
  return res.status(200).send("Ok");
});

export default userRouter;

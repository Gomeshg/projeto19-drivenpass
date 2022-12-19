import { Router } from "express";
import { signUp, signIn } from "../controller/user-controller.js";
import validateUser from "../middlewares/user-middleware.js";

const userRouter = Router();

userRouter.post("/sign-up", validateUser, signUp);
userRouter.post("/sign-in", validateUser, signIn);

export default userRouter;

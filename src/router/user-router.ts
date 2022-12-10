import { Router } from "express";
import { signUp, signIn } from "../controller/user-controller.js";
import validateBody from "../middlewares/validate-middleware.js";

const userRouter = Router();

userRouter.post("/sign-up", validateBody, signUp);
userRouter.post("/sign-in", signIn);

export default userRouter;

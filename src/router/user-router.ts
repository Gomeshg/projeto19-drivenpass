import { Router } from "express";
// import { signUp, signIn } from "../controller/user-controller.js";
// import validateUser from "../middlewares/user-middleware.js";
import { signUp, signIn } from "../controller/user-controller";
import validateUser from "../middlewares/user-middleware";

const userRouter = Router();

userRouter.post("/sign-up", validateUser, signUp);
userRouter.post("/sign-in", validateUser, signIn);

export default userRouter;

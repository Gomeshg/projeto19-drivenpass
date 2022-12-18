import { Router } from "express";

//importar todas as rotas
import userRouter from "./user-router.js";
import credentialRouter from "./credential-router.js";

const router = Router();

router.use(userRouter).use(credentialRouter);

export default router;

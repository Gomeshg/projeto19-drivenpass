import { Router } from "express";

//importar todas as rotas
import userRouter from "./user-router.js";

const router = Router();

router.use(userRouter);

export default router;

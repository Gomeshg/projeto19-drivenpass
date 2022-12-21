import { Router } from "express";

//importar todas as rotas
// import userRouter from "./user-router.js";
// import credentialRouter from "./credential-router.js";
// import networkRouter from "./network-router.js";
import userRouter from "./user-router";
import credentialRouter from "./credential-router";
import networkRouter from "./network-router";

const router = Router();

router.use(userRouter).use(credentialRouter).use(networkRouter);

export default router;

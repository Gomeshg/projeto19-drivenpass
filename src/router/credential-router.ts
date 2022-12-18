import { Router } from "express";
import authToken from "../middlewares/auth-middleware.js";
import validateCredential from "../middlewares/validateCredential-middlware.js";
import {
  postOneCredential,
  getOneCredential,
  getAllCredentials,
  deleteOneCredential,
  updateOneCredential,
} from "../controller/credential-controller.js";

const credentialRouter = Router();

credentialRouter.post(
  "/credential",
  authToken,
  validateCredential,
  postOneCredential
);
credentialRouter.get("/credential/:id", authToken, getOneCredential);
credentialRouter.get("/credential", authToken, getAllCredentials);
credentialRouter.delete("/credential/:id", authToken, deleteOneCredential);
credentialRouter.put("/credential/:id", authToken, updateOneCredential);

export default credentialRouter;

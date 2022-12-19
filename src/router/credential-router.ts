import { Router } from "express";
import authToken from "../middlewares/token-middleware.js";
import validateCredential from "../middlewares/post-credential-middlware.js";
import validateCredentialID from "../middlewares/id-credential-middleware.js";
import valiteUpdateCredential from "../middlewares/update-credential-middleware.js";
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

credentialRouter.get(
  "/credential/:id",
  authToken,
  validateCredentialID,
  getOneCredential
);

credentialRouter.get("/credential", authToken, getAllCredentials);

credentialRouter.delete(
  "/credential/:id",
  authToken,
  validateCredentialID,
  deleteOneCredential
);

credentialRouter.put(
  "/credential/:id",
  authToken,
  validateCredentialID,
  valiteUpdateCredential,
  updateOneCredential
);

export default credentialRouter;

import { Router } from "express";
// import authToken from "../middlewares/token-middleware.js";
// import validateCredential from "../middlewares/post-credential-middlware.js";
// import validateID from "../middlewares/id-middleware.js";
// import validateUpdateCredential from "../middlewares/update-credential-middleware.js";
// import {
//   postOneCredential,
//   getOneCredential,
//   getAllCredentials,
//   deleteOneCredential,
//   updateOneCredential,
// } from "../controller/credential-controller.js";
import authToken from "../middlewares/token-middleware";
import validateCredential from "../middlewares/post-credential-middlware";
import validateID from "../middlewares/id-middleware";
import validateUpdateCredential from "../middlewares/update-credential-middleware";
import {
  postOneCredential,
  getOneCredential,
  getAllCredentials,
  deleteOneCredential,
  updateOneCredential,
} from "../controller/credential-controller";

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
  validateID,
  getOneCredential
);

credentialRouter.get("/credential", authToken, getAllCredentials);

credentialRouter.delete(
  "/credential/:id",
  authToken,
  validateID,
  deleteOneCredential
);

credentialRouter.put(
  "/credential/:id",
  authToken,
  validateID,
  validateUpdateCredential,
  updateOneCredential
);

export default credentialRouter;

import { Router } from "express";
// import {
//   getAllNetworks,
//   getOneNetwork,
//   postNetwork,
//   deleteNetwork,
//   updateNetwork,
// } from "../controller/network-controller.js";
// import authToken from "../middlewares/token-middleware.js";
// import validateID from "../middlewares/id-middleware.js";
// import validateNetwork from "../middlewares/post-network-middleware.js";
import {
  getAllNetworks,
  getOneNetwork,
  postNetwork,
  deleteNetwork,
  updateNetwork,
} from "../controller/network-controller";
import authToken from "../middlewares/token-middleware";
import validateID from "../middlewares/id-middleware";
import validateNetwork from "../middlewares/post-network-middleware";

const networkRouter = Router();

networkRouter.get("/network", authToken, getAllNetworks);
networkRouter.get("/network/:id", authToken, validateID, getOneNetwork);
networkRouter.post("/network", authToken, validateNetwork, postNetwork);
networkRouter.delete("/network/:id", authToken, validateID, deleteNetwork);
networkRouter.put("/network/:id", authToken, validateID, updateNetwork);

export default networkRouter;

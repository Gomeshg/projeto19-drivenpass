import express, { Express, json } from "express";
import cors from "cors";
import dotenv from "dotenv";
// import router from "./router/index-router.js";
import router from "./router/index-router";

dotenv.config();

const server: Express = express();

server.use(cors()).use(json()).use(router);

server.listen(process.env.PORT, () => {
  console.log("Servidor rodando com sucesso!");
});

export default server;

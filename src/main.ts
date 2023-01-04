import express, { Express, json } from "express";
import cors from "cors";
import dotenv from "dotenv";
// import prisma from "./database/database.js";
// import router from "./router/index-router.js";
import prisma from "./database/database";
import router from "./router/index-router";
import networkRepository from "./repository/network-repository";

dotenv.config();

const server: Express = express();

server.use(cors()).use(json()).use(router);

try {
  server.listen({ host: "localhost", port: process.env.PORT });
} catch (err) {
  console.log("Xabu");
}

export default server;

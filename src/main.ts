import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./database/database.js";
import router from "./router/index-router.js";

dotenv.config();

const server = express();

server.use(cors()).use(json()).use(router);

server.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
  if (prisma) {
    console.log("Banco de dados conectado com sucesso!");
  }
});

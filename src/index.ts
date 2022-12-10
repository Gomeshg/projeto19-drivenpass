import express from "express";
import dotenv from "dotenv";
import prisma from "./database/database.js";

dotenv.config();

const server = express();

server.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
  if (prisma) {
    console.log("Banco de dados conectado com sucesso!");
  }
});

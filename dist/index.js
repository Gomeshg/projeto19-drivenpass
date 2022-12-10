import express from "express";
import dotenv from "dotenv";
dotenv.config();
var server = express();
server.listen(process.env.PORT, function () {
    console.log("Servidor rodando na porta ".concat(process.env.PORT));
});

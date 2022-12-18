import { Request, Response } from "express";
import status from "http-status";
import { CredentialType } from "../protocols/types.js";
import credentialService from "../service/credential-service.js";

//MANUTENÇÃO
async function postOneCredential(req: Request, res: Response) {
  const userId = res.locals.userId as number;
  const newCredential = { ...req.body, userId: userId } as CredentialType;

  try {
    await credentialService.createCredential(newCredential);

    return res.status(status.CREATED).send("Credential Created Sucessfully");
  } catch (error) {
    if (error.name === "ConflictError") {
      return res.status(status.CONFLICT).send(error.message);
    }
    return res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
}

async function getOneCredential(req: Request, res: Response) {
  return res.status(status.OK).send("GET ONE");
}

async function getAllCredentials(req: Request, res: Response) {
  return res.status(status.OK).send("GET ALL");
}

async function deleteOneCredential(req: Request, res: Response) {
  return res.status(status.OK).send("DELETE");
}

async function updateOneCredential(req: Request, res: Response) {
  return res.status(status.OK).send("UPDATE");
}

export {
  postOneCredential,
  getOneCredential,
  getAllCredentials,
  deleteOneCredential,
  updateOneCredential,
};

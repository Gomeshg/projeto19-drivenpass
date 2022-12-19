import { Request, Response } from "express";
import status from "http-status";
import { CredentialType, CredentialUpdateType } from "../protocols/types.js";
import credentialService from "../service/credential-service.js";

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
  const userId = res.locals.userId as number;
  const credentialId = res.locals.credentialId as number;

  try {
    const credential = await credentialService.findOneCredential(
      userId,
      credentialId
    );

    return res.status(status.OK).send(credential);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.status(status.NOT_FOUND).send(error.message);
    } else if (error.name === "UnauthorizedError") {
      return res.sendStatus(status.UNAUTHORIZED);
    }

    return res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
}

async function getAllCredentials(req: Request, res: Response) {
  const userId = res.locals.userId as number;

  try {
    const allCredentials = await credentialService.findAllCredentials(userId);
    return res.status(status.OK).send(allCredentials);
  } catch {
    return res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
}

async function deleteOneCredential(req: Request, res: Response) {
  const userId = res.locals.userId as number;
  const credentialId = res.locals.credentialId as number;

  try {
    await credentialService.deleteCredential(userId, credentialId);
    return res.sendStatus(status.OK);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(status.NOT_FOUND);
    } else if (error.name === "UnauthorizedError") {
      return res.sendStatus(status.UNAUTHORIZED);
    }

    return res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
}

async function updateOneCredential(req: Request, res: Response) {
  const userId = res.locals.userId as number;
  const credentialId = res.locals.credentialId as number;
  const credentialUpdated = req.body as CredentialUpdateType;

  try {
    await credentialService.updateCredential(
      userId,
      credentialId,
      credentialUpdated
    );
    return res.sendStatus(status.OK);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(status.NOT_FOUND);
    } else if (error.name === "UnauthorizedError") {
      return res.sendStatus(status.UNAUTHORIZED);
    } else if (error.name === "ConflictError") {
      return res.status(status.CONFLICT).send(error.message);
    }

    return res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
}

export {
  postOneCredential,
  getOneCredential,
  getAllCredentials,
  deleteOneCredential,
  updateOneCredential,
};

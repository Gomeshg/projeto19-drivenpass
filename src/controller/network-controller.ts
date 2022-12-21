import { Request, Response } from "express";
import networkService from "../service/network-service";
import { NetworkType, NetworkUpdateType } from "../protocols/types";
import status from "http-status";

async function getAllNetworks(req: Request, res: Response) {
  const userId = res.locals.userId as number;

  try {
    const allNetworks = await networkService.getAllNetwork(userId);
    return res.status(status.OK).send(allNetworks);
  } catch (error) {
    return res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
}

async function getOneNetwork(req: Request, res: Response) {
  const userId = res.locals.userId as number;
  const networkId = res.locals.id as number;
  try {
    const network = await networkService.getOneNetwork(userId, networkId);
    return res.status(status.OK).send(network);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(status.NOT_FOUND);
    } else if (error.name === "UnauthorizedError") {
      return res.sendStatus(status.UNAUTHORIZED);
    }
    return res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
}

async function postNetwork(req: Request, res: Response) {
  const userId = res.locals.userId as number;
  const newNetwork = { ...req.body, userId: userId } as NetworkType;

  try {
    await networkService.insertNetwork(newNetwork);
    return res.status(201).send({ feedback: "Network created sucessfully" });
  } catch (error) {
    return res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
}

async function deleteNetwork(req: Request, res: Response) {
  const userId = res.locals.userId as number;
  const networkId = res.locals.id as number;

  try {
    await networkService.deleteNetwork(userId, networkId);
    return res.status(200).send({ feedback: "Network deleted sucessfully" });
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(status.NOT_FOUND);
    } else if (error.name === "UnauthorizedError") {
      return res.sendStatus(status.UNAUTHORIZED);
    }

    return res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
}

async function updateNetwork(req: Request, res: Response) {
  const userId = res.locals.userId as number;
  const networkId = res.locals.id as number;
  const networkUpdated = req.body as NetworkUpdateType;

  try {
    await networkService.updateNetwork(userId, networkId, networkUpdated);
    return res.status(200).send({ feedback: "Network updated sucessfully" });
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(status.NOT_FOUND);
    } else if (error.name === "UnauthorizedError") {
      return res.sendStatus(status.UNAUTHORIZED);
    }

    return res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
}

export {
  getAllNetworks,
  getOneNetwork,
  postNetwork,
  deleteNetwork,
  updateNetwork,
};

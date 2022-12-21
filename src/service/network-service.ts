// import networkRepository from "../repository/network-repository.js";
// import { NetworkType, NetworkUpdateType } from "../protocols/types.js";
// import { notFoundError, unauthorizedError } from "../erros/index-errors.js";
// import { secretKey } from "../protocols/secretKey.js";
import networkRepository from "../repository/network-repository";
import { NetworkType, NetworkUpdateType } from "../protocols/types";
import { notFoundError, unauthorizedError } from "../erros/index-errors";
import { secretKey } from "../protocols/secretKey";
import Cryptr from "cryptr";
const cryptr = new Cryptr(secretKey);

async function insertNetwork(network: NetworkType): Promise<void> {
  network.password = cryptr.encrypt(network.password);
  await networkRepository.createNetwork(network);
}

async function getAllNetwork(userId: number): Promise<NetworkType[]> {
  const allNetwork = await networkRepository.findAllNetwork(userId);

  const allNetworkDescrypt = allNetwork.map((item) => {
    item.password = cryptr.decrypt(item.password);
    return item;
  });

  return allNetworkDescrypt;
}

async function getOneNetwork(
  userId: number,
  id: number
): Promise<NetworkType | null> {
  const thereIsNetwork = await networkRepository.findOneNetwork(id);
  if (!thereIsNetwork) {
    throw notFoundError();
  }

  const networkBelongsUser = await networkRepository.findOneNetwork(id);
  if (networkBelongsUser?.userId !== userId) {
    throw unauthorizedError();
  }

  const network = await networkRepository.findOneNetwork(id);
  if (network) {
    network.password = cryptr.decrypt(network.password);
  }

  return network;
}

async function deleteNetwork(userId: number, id: number) {
  const thereIsNetwork = await networkRepository.findOneNetwork(id);
  if (!thereIsNetwork) {
    throw notFoundError();
  }

  const networkBelongsUser = await networkRepository.findOneNetwork(id);
  if (networkBelongsUser?.userId !== userId) {
    throw unauthorizedError();
  }

  await networkRepository.deleteNetwork(id);
}

async function updateNetwork(
  userId: number,
  id: number,
  networkUpdated: NetworkUpdateType
) {
  const thereIsNetwork = await networkRepository.findOneNetwork(id);
  if (!thereIsNetwork) {
    throw notFoundError();
  }

  const networkBelongsUser = await networkRepository.findOneNetwork(id);
  if (networkBelongsUser?.userId !== userId) {
    throw unauthorizedError();
  }

  await networkRepository.updateNetwork(id, networkUpdated);
}

const networkService = {
  insertNetwork,
  getAllNetwork,
  getOneNetwork,
  deleteNetwork,
  updateNetwork,
};

export default networkService;

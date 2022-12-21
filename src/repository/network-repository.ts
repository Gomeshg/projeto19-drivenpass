// import prisma from "../database/database.js";
// import { NetworkType, NetworkUpdateType } from "../protocols/types.js";
import prisma from "../database/database";
import { NetworkType, NetworkUpdateType } from "../protocols/types";

async function findOneNetwork(id: number): Promise<NetworkType | null> {
  return prisma.network.findUnique({
    where: {
      id: id,
    },
  });
}

async function findAllNetwork(userId: number): Promise<NetworkType[]> {
  return prisma.network.findMany({
    where: {
      userId: userId,
    },
  });
}

async function createNetwork(network: NetworkType) {
  return prisma.network.create({
    data: network,
  });
}

async function deleteNetwork(id: number) {
  return prisma.network.delete({
    where: {
      id: id,
    },
  });
}

async function updateNetwork(id: number, networkUpdated: NetworkUpdateType) {
  return prisma.network.update({
    where: {
      id: id,
    },
    data: networkUpdated,
  });
}

const networkRepository = {
  findOneNetwork,
  findAllNetwork,
  createNetwork,
  deleteNetwork,
  updateNetwork,
};

export default networkRepository;

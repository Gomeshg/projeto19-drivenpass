import prisma from "../../src/database/database";
import { newNetwork } from "./data";

export function createNetwork(userId: number) {
  const network = newNetwork(userId);
  return prisma.network.create({
    data: network,
  });
}

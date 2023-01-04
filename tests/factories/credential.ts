import prisma from "../../src/database/database";
import { newCredential } from "./data";

export function createCredential(userId: number) {
  const credential = newCredential(userId);
  return prisma.credential.create({
    data: credential,
  });
}

export function getCredential(userId: number) {
  return prisma.credential.findMany({
    where: {
      userId: userId,
    },
  });
}

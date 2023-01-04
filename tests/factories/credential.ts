import prisma from "../../src/database/database";
import { newCredential } from "./data";

export function createCredential(userId: number) {
  const credential = newCredential(userId);
  return prisma.credential.create({
    data: credential,
  });
}

export function createSpecificCredential(
  userId: number,
  title: string,
  url: string
) {
  const credential = newCredential(userId);
  if (title) {
    credential.title = title;
  }
  if (url) {
    credential.url = url;
  }

  return prisma.credential.create({
    data: credential,
  });
}

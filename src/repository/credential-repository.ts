import prisma from "../database/database.js";
import { CredentialType } from "../protocols/types.js";

async function createCredential(newCredential: CredentialType) {
  return prisma.credential.create({
    data: newCredential,
  });
}

async function findAllCredentials(userId: number) {
  return prisma.credential.findMany({
    where: {
      userId: userId,
    },
  });
}

async function findOneCredentialById(userId: number, id: number) {
  return prisma.credential.findFirst({
    where: {
      id: id,
      userId: userId,
    },
  });
}

async function findOneCredentiaByTitle(userId: number, title: string) {
  return prisma.credential.findFirst({
    where: {
      title: title,
      userId: userId,
    },
  });
}

async function filterCredentialsByUrl(userId: number, url: string) {
  return prisma.credential.findMany({
    where: {
      userId: userId,
      url: url,
    },
  });
}

async function deleteCredential(userId: number, id: number) {
  return prisma.credential.deleteMany({
    where: {
      id: id,
      userId: userId,
    },
  });
}

async function updateCredential(userId: number, id: number, data: object) {
  return prisma.credential.updateMany({
    where: {
      id: id,
      userId: userId,
    },
    data: data,
  });
}

const credentialRepository = {
  createCredential,
  findAllCredentials,
  findOneCredentialById,
  findOneCredentiaByTitle,
  filterCredentialsByUrl,
  deleteCredential,
  updateCredential,
};

export default credentialRepository;

import credentialRepository from "../repository/credential-repository.js";
import { CredentialType, CredentialUpdateType } from "../protocols/types.js";
import {
  conflictError,
  unauthorizedError,
  notFoundError,
} from "../erros/index-errors.js";
import Cryptr from "cryptr";
import { secretKey } from "../protocols/secretKey.js";
const cryptr = new Cryptr(secretKey);

async function createCredential(newCredential: CredentialType): Promise<void> {
  const credentialFiltredByUrl =
    await credentialRepository.filterCredentialsByUrl(
      newCredential.userId,
      newCredential.url
    );
  if (credentialFiltredByUrl.length >= 2) {
    throw conflictError("Url limited exceeded");
  }

  const titleAlreadyUsed = await credentialRepository.findOneCredentiaByTitle(
    newCredential.userId,
    newCredential.title
  );
  if (titleAlreadyUsed) {
    throw conflictError("Title already used");
  }

  newCredential.password = cryptr.encrypt(newCredential.password);
  await credentialRepository.createCredential(newCredential);
}

async function findOneCredential(
  userId: number,
  id: number
): Promise<CredentialType | null> {
  const thereIsCredential = await credentialRepository.findOneCredentialById(
    id
  );
  if (!thereIsCredential) {
    throw notFoundError();
  }

  const credentialBelongsUser =
    await credentialRepository.findOneCredentialById(id);

  if (credentialBelongsUser?.userId !== userId) {
    throw unauthorizedError();
  }

  return credentialRepository.findOneCredentialById(id);
}

async function findAllCredentials(userId: number): Promise<CredentialType[]> {
  const allCredentials = await credentialRepository.findAllCredentials(userId);

  const allCredentialsDescrypt = allCredentials.map((item) => {
    item.password = cryptr.decrypt(item.password);
    return item;
  });

  return allCredentialsDescrypt;
}

async function deleteCredential(userId: number, id: number): Promise<void> {
  const thereIsCredential = await credentialRepository.findOneCredentialById(
    id
  );
  if (!thereIsCredential) {
    throw notFoundError();
  }

  const credentialBelongsUser =
    await credentialRepository.findOneCredentialById(id);

  if (credentialBelongsUser?.userId !== userId) {
    throw unauthorizedError();
  }

  await credentialRepository.deleteCredential(userId, id);
}

async function updateCredential(
  userId: number,
  id: number,
  credentialUpdated: CredentialUpdateType
): Promise<void> {
  const thereIsCredential = await credentialRepository.findOneCredentialById(
    id
  );
  if (!thereIsCredential) {
    throw notFoundError();
  }

  const credentialBelongsUser =
    await credentialRepository.findOneCredentialById(id);

  if (credentialBelongsUser?.userId !== userId) {
    throw unauthorizedError();
  }

  if (credentialUpdated.url) {
    const credentialFiltredByUrl =
      await credentialRepository.filterCredentialsByUrl(
        userId,
        credentialUpdated.url as string
      );
    if (credentialFiltredByUrl.length >= 2) {
      throw conflictError("Url limited exceeded");
    }
  }

  if (credentialUpdated.title) {
    const titleAlreadyUsed = await credentialRepository.findOneCredentiaByTitle(
      userId,
      credentialUpdated.title as string
    );
    if (titleAlreadyUsed) {
      throw conflictError("Title already used");
    }
  }

  if (credentialUpdated.password) {
    credentialUpdated.password = cryptr.encrypt(
      credentialUpdated.password as string
    );
  }

  await credentialRepository.updateCredential(userId, id, credentialUpdated);
}

const credentialService = {
  createCredential,
  findOneCredential,
  findAllCredentials,
  deleteCredential,
  updateCredential,
};

export default credentialService;

import credentialRepository from "../repository/credential-repository.js";
import { CredentialType } from "../protocols/types.js";
import { conflictError, unauthorizedError } from "../erros/index-errors.js";
import Cryptr from "cryptr";
import { secretKey } from "../protocols/secretKey.js";

async function createCredential(newCredential: CredentialType) {
  const cryptr = new Cryptr(secretKey);

  const credentialFiltredByUrl =
    await credentialRepository.filterCredentialsByUrl(
      newCredential.userId,
      newCredential.url
    );
  if (credentialFiltredByUrl.length >= 2) {
    throw conflictError("Url limited exceeded");
  }

  const titleAlredyUsed = await credentialRepository.findOneCredentiaByTitle(
    newCredential.userId,
    newCredential.title
  );
  if (titleAlredyUsed) {
    throw conflictError("Title alredy used");
  }

  newCredential.password = cryptr.encrypt(newCredential.password);
  return credentialRepository.createCredential(newCredential);
}

const credentialService = {
  createCredential,
};

export default credentialService;

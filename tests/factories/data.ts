import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";
import { secretKey } from "../../src/protocols/secretKey";
import { CredentialType, NetworkType } from "../../src/protocols/types";
import Cryptr from "cryptr";
const cryptr = new Cryptr(secretKey);

const EMAIL = "gomes.hugo00@gmail.com";
const PASSWORD = "12345678910";

function newCredential(userId: number): CredentialType {
  return {
    title: faker.name.firstName(),
    url: faker.internet.url(),
    username: faker.name.firstName(),
    password: cryptr.encrypt(faker.internet.password()),
    userId: userId,
  };
}

function newNetwork(userId: number): NetworkType {
  return {
    title: faker.name.firstName(),
    network: faker.internet.domainWord(),
    password: cryptr.encrypt(faker.internet.password()),
    userId: userId,
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createToken(userId: number, time: number) {
  return jwt.sign({ userId: userId }, secretKey, {
    expiresIn: time,
  });
}

export { EMAIL, PASSWORD, newCredential, newNetwork, sleep, createToken };

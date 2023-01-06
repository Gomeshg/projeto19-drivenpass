import status from "http-status";
import supertest from "supertest";
import server from "../src/main";
import prisma from "../src/database/database";
import {
  UserType,
  SessionType,
  CredentialType,
  CredentialUpdateType,
  NetworkType,
  NetworkUpdateType,
} from "../src/protocols/types";

import createUser from "./factories/user";
import createSession from "./factories/session";
import {
  createCredential,
  createSpecificCredential,
} from "./factories/credential";
import { createNetwork } from "../tests/factories/network";
import jwt from "jsonwebtoken";
import { secretKey, oneSecond, fourHours } from "../src/protocols/secretKey";
import Cryptr from "cryptr";
const cryptr = new Cryptr(secretKey);

import {
  EMAIL,
  PASSWORD,
  newCredential,
  newNetwork,
  sleep,
  createToken,
} from "./factories/data";

const api = supertest(server);

describe("POST /sign-up", () => {
  afterAll(async () => {
    await prisma.network.deleteMany();
    await prisma.credential.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  beforeEach(async () => {
    await prisma.network.deleteMany();
    await prisma.credential.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  it("Test case: 400 | invalid properties", async () => {
    const result = await api
      .post("/sign-up")
      .send({ nome: "Propriedade inválida" });
    expect(result.status).toBe(status.BAD_REQUEST);
  });

  it("Test case: 400 | invalid type of values", async () => {
    const result = await api
      .post("/sign-up")
      .send({ email: "email invalido", password: "senha" });
    expect(result.status).toBe(status.BAD_REQUEST);
  });

  it("Test case: 409 | email already exists", async () => {
    await prisma.user.deleteMany();

    await createUser(EMAIL, PASSWORD);

    const result = await api
      .post("/sign-up")
      .send({ email: EMAIL, password: PASSWORD });
    expect(result.status).toBe(status.CONFLICT);
  });

  it("Test case: 201 | sucessfully", async () => {
    const result = await api
      .post("/sign-up")
      .send({ email: EMAIL, password: PASSWORD });
    expect(result.status).toBe(status.CREATED);
  });
});

describe("POST /sign-in", () => {
  afterAll(async () => {
    await prisma.network.deleteMany();
    await prisma.credential.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  beforeEach(async () => {
    await prisma.network.deleteMany();
    await prisma.credential.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  it("Test case: 400 | invalid properties", async () => {
    const result = await api
      .post("/sign-in")
      .send({ nome: "propriedade inválida" });
    expect(result.status).toBe(status.BAD_REQUEST);
  });

  it("Test case: 400 | invalid type of values", async () => {
    const result = await api
      .post("/sign-in")
      .send({ email: "email inválido", password: undefined });
    expect(result.status).toBe(status.BAD_REQUEST);
  });

  it("Test case: 401 | invalid email", async () => {
    await createUser(EMAIL, PASSWORD);

    const result = await api
      .post("/sign-in")
      .send({ email: "emailinvalido@gmail.com", password: PASSWORD });
    expect(result.status).toBe(status.UNAUTHORIZED);
  });

  it("Test case: 401 | invalid password", async () => {
    await createUser(EMAIL, PASSWORD);

    const result = await api
      .post("/sign-in")
      .send({ email: EMAIL, password: "senhainvalida" });
    expect(result.status).toBe(status.UNAUTHORIZED);
  });

  it("Test case: 200 | sucessfully", async () => {
    await createUser(EMAIL, PASSWORD);

    const result = await api
      .post("/sign-in")
      .send({ email: EMAIL, password: PASSWORD });
    expect(result.status).toBe(status.OK);
  });
});

describe("POST / credential", () => {
  afterAll(async () => {
    await prisma.network.deleteMany();
    await prisma.credential.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  beforeEach(async () => {
    await prisma.network.deleteMany();
    await prisma.credential.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  it("Test case: 400 | invalid properties", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    const session = await createSession(createdUser.id, token);

    const newCredential = {
      titulo: "errado",
      urlinda: "https://beta.openai.com/playground",
      nome: "nome",
      senha: "errada",
    };

    const result = await api
      .post("/credential")
      .set("Authorization", `Bearer ${session.token}`)
      .send(newCredential);

    expect(result.status).toBe(status.BAD_REQUEST);
  });

  it("Test case: 400 | invalid types of values", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = jwt.sign({ userId: createdUser.id }, secretKey, {
      expiresIn: fourHours,
    });
    const session = await createSession(createdUser.id, token);

    const newCredential = {
      title: 100,
      url: "www.google.com",
      username: null,
      password: "errada",
      userId: "1",
    };

    const result = await api
      .post("/credential")
      .set("Authorization", `Bearer ${session.token}`)
      .send(newCredential);

    expect(result.status).toBe(status.BAD_REQUEST);
  });

  it("Test case: 400 | non-existent token", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const credential = newCredential(createdUser.id);
    const result = await api.post("/credential").send(credential);

    expect(result.status).toBe(status.BAD_REQUEST);
  });

  it("Test case: 401 | invalid token", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    await createSession(createdUser.id, token);

    const credential = newCredential(createdUser.id);

    const result = await api
      .post("/credential")
      .set("Authorization", `Bearer 1234-abcd-5678-efgh`)
      .send(credential);

    expect(result.status).toBe(status.UNAUTHORIZED);
  });

  it("Test case: 401 | expired token", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, oneSecond);
    const session = await createSession(createdUser.id, token);

    const credential = newCredential(createdUser.id);

    await sleep(2000);

    const result = await api
      .post("/credential")
      .set("Authorization", `Bearer ${session.token}`)
      .send(credential);

    expect(result.status).toBe(status.UNAUTHORIZED);
  });

  it("Test case: 409 | title already used", async () => {
    const createdUser: UserType = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id as number, fourHours);
    const session: SessionType = await createSession(
      createdUser.id as number,
      token
    );

    const credential: CredentialType = await createCredential(
      createdUser.id as number
    );

    delete credential.id;

    const result = await api
      .post("/credential")
      .set("Authorization", `Bearer ${session.token}`)
      .send(credential);

    expect(result.status).toBe(status.CONFLICT);
  });

  it("Test case: 409 | url limited exceeded", async () => {
    const createdUser: UserType = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id as number, fourHours);
    const session: SessionType = await createSession(
      createdUser.id as number,
      token
    );

    for (let i = 0; i < 2; i++) {
      await createSpecificCredential(
        createdUser.id as number,
        `titulo${i + 1}`,
        "https://beta.openai.com/playground"
      );
    }

    const result = await api
      .post("/credential")
      .set("Authorization", `Bearer ${session.token}`)
      .send({
        title: "titulo3",
        url: "https://beta.openai.com/playground",
        username: "nome",
        password: "senha",
      });

    expect(result.status).toBe(status.CONFLICT);
  });

  it("Test case: 201 | sucessfully", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = jwt.sign({ userId: createdUser.id }, secretKey, {
      expiresIn: fourHours,
    });
    const session = await createSession(createdUser.id, token);
    const credential = newCredential(createdUser.id);

    const result = await api
      .post("/credential")
      .set("Authorization", `Bearer ${session.token}`)
      .send(credential);

    expect(result.status).toBe(status.CREATED);
  });
});

describe("GET / credential", () => {
  afterAll(async () => {
    await prisma.network.deleteMany();
    await prisma.credential.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  beforeEach(async () => {
    await prisma.network.deleteMany();
    await prisma.credential.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  it("Test case 400 - getAll | non-existent token", async () => {
    const result = await api.get("/credential");
    expect(result.status).toBe(status.BAD_REQUEST);
  });

  it("Test case 401 - getAll | invalid token", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    await createSession(createdUser.id, token);

    const result = await api
      .get("/credential")
      .set("Authorization", `Bearer 1234-abcd-5678-efgh`);

    expect(result.status).toBe(status.UNAUTHORIZED);
  });

  it("Test case 401 - getAll | expired token", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, oneSecond);
    const session = await createSession(createdUser.id, token);

    await sleep(2000);

    const result = await api
      .get("/credential")
      .set("Authorization", `Bearer ${session.token}`);

    expect(result.status).toBe(status.UNAUTHORIZED);
  });

  it("Test case 200 - getAll | sucessfully", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    const session = await createSession(createdUser.id, token);

    const createdCredentials: CredentialType[] = [];

    for (let i = 0; i < 5; i++) {
      createdCredentials.push(await createCredential(createdUser.id));
    }

    for (let j = 0; j < createdCredentials.length; j++) {
      createdCredentials[j].password = cryptr.decrypt(
        createdCredentials[j].password
      );
    }

    const result = await api
      .get("/credential")
      .set("Authorization", `Bearer ${session.token}`);

    expect(result.status).toBe(status.OK);
    expect(result.body).toEqual(createdCredentials);
  });

  it("Test case 400 - getOne | invalid params", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    const session = await createSession(createdUser.id, token);

    const result = await api
      .get(`/credential/abc`)
      .set("Authorization", `Bearer ${session.token}`);

    expect(result.status).toBe(status.BAD_REQUEST);
  });

  it("Test case 404 - getOne | non-existent credential", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    const session = await createSession(createdUser.id, token);

    const result = await api
      .get(`/credential/1`)
      .set("Authorization", `Bearer ${session.token}`);

    expect(result.status).toBe(status.NOT_FOUND);
  });

  it("Test case 401 - getOne | credential belongs other user", async () => {
    const createdUser: UserType = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id as number, fourHours);
    const session: SessionType = await createSession(
      createdUser.id as number,
      token
    );

    const auxUser: UserType = await createUser(
      "usuarioaxuliar@gmail.com",
      "senhadousuario"
    );

    const createdCredentialFromAuxUser: CredentialType = await createCredential(
      auxUser.id as number
    );

    const result = await api
      .get(`/credential/${createdCredentialFromAuxUser.id}`)
      .set("Authorization", `Bearer ${session.token}`);

    expect(result.status).toBe(status.UNAUTHORIZED);
  });

  it("Test case 400 - getOne | non-existent token", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    await createSession(createdUser.id, token);

    const result = await api.get(`/credential/1`);

    expect(result.status).toBe(status.BAD_REQUEST);
  });

  it("Test case 401 - getOne | invalid token", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    const session = await createSession(createdUser.id, token);

    const result = await api
      .get(`/credential/1`)
      .set("Authorization", `Bearer 1234-abcd-5678-efgh`);

    expect(result.status).toBe(status.UNAUTHORIZED);
  });

  it("Test case 401 - getOne | expired token", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, oneSecond);
    const session = await createSession(createdUser.id, token);

    await sleep(2000);

    const result = await api
      .get(`/credential/1`)
      .set("Authorization", `Bearer ${session.token}`);

    expect(result.status).toBe(status.UNAUTHORIZED);
  });

  it("Test case 200 - getOne | sucessfully", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    const session = await createSession(createdUser.id, token);

    const createdCredential: CredentialType = await createCredential(
      createdUser.id
    );

    createdCredential.password = cryptr.decrypt(createdCredential.password);

    const result = await api
      .get(`/credential/${createdCredential.id}`)
      .set("Authorization", `Bearer ${session.token}`);

    expect(result.status).toBe(status.OK);
    expect(result.body).toEqual(createdCredential);
  });
});

describe("DELETE /credential", () => {
  afterAll(async () => {
    await prisma.network.deleteMany();
    await prisma.credential.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  beforeEach(async () => {
    await prisma.network.deleteMany();
    await prisma.credential.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  it("Test case 400 | non-existent token", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    await createSession(createdUser.id, token);

    const result = await api.delete(`/credential/1`);

    expect(result.status).toBe(status.BAD_REQUEST);
  });

  it("Test case 401 | invalid token", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    const session = await createSession(createdUser.id, token);

    const result = await api
      .delete(`/credential/1`)
      .set("Authorization", `Bearer 1234-abcd-5678-efgh`);

    expect(result.status).toBe(status.UNAUTHORIZED);
  });

  it("Test case 401 | expired token", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, oneSecond);
    const session = await createSession(createdUser.id, token);

    await sleep(2000);

    const result = await api
      .delete(`/credential/1`)
      .set("Authorization", `Bearer ${session.token}`);

    expect(result.status).toBe(status.UNAUTHORIZED);
  });

  it("Test case 400 | invalid params", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    const session = await createSession(createdUser.id, token);

    const result = await api
      .delete(`/credential/abc`)
      .set("Authorization", `Bearer ${session.token}`);

    expect(result.status).toBe(status.BAD_REQUEST);
  });

  it("Test case 404 | non-existent credential", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    const session = await createSession(createdUser.id, token);

    const result = await api
      .delete(`/credential/1`)
      .set("Authorization", `Bearer ${session.token}`);

    expect(result.status).toBe(status.NOT_FOUND);
  });

  it("Test case 401 | credential belongs other user", async () => {
    const createdUser: UserType = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id as number, fourHours);
    const session: SessionType = await createSession(
      createdUser.id as number,
      token
    );

    const auxUser: UserType = await createUser(
      "usuarioaxuliar@gmail.com",
      "senhadousuario"
    );

    const createdCredentialFromAuxUser: CredentialType = await createCredential(
      auxUser.id as number
    );

    const result = await api
      .delete(`/credential/${createdCredentialFromAuxUser.id}`)
      .set("Authorization", `Bearer ${session.token}`);

    expect(result.status).toBe(status.UNAUTHORIZED);
  });

  it("Test case 200 | sucessfully", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    const session = await createSession(createdUser.id, token);

    const createdCredential: CredentialType = await createCredential(
      createdUser.id
    );

    const result = await api
      .delete(`/credential/${createdCredential.id}`)
      .set("Authorization", `Bearer ${session.token}`);

    expect(result.status).toBe(status.OK);
  });
});

describe("UPDATE /credential", () => {
  afterAll(async () => {
    await prisma.network.deleteMany();
    await prisma.credential.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  beforeEach(async () => {
    await prisma.network.deleteMany();
    await prisma.credential.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  it("Test case 400 | non-existent token", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    await createSession(createdUser.id, token);

    const result = await api.put(`/credential/1`).send({});

    expect(result.status).toBe(status.BAD_REQUEST);
  });

  it("Test case 401 | invalid token", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    await createSession(createdUser.id, token);

    const result = await api
      .put(`/credential/1`)
      .set("Authorization", `Bearer 1234-abcd-5678-efgh`)
      .send({});

    expect(result.status).toBe(status.UNAUTHORIZED);
  });

  it("Test case 401 | expired token", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, oneSecond);
    const session = await createSession(createdUser.id, token);

    await sleep(2000);

    const result = await api
      .put(`/credential/1`)
      .set("Authorization", `Bearer ${session.token}`)
      .send({});

    expect(result.status).toBe(status.UNAUTHORIZED);
  });

  it("Test case 400 | invalid params", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    const session = await createSession(createdUser.id, token);

    const result = await api
      .put(`/credential/abc`)
      .set("Authorization", `Bearer ${session.token}`)
      .send({});

    expect(result.status).toBe(status.BAD_REQUEST);
  });

  it("Test case 400 | invalid properties", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    const session = await createSession(createdUser.id, token);

    const credential: CredentialType = await createCredential(createdUser.id);

    const newCredential = {
      titulo: "errado",
      urlinda: "https://beta.openai.com/playground",
      nome: "nome",
      senha: "errada",
    };

    const result = await api
      .put(`/credential/${credential.id}`)
      .set("Authorization", `Bearer ${session.token}`)
      .send(newCredential);

    expect(result.status).toBe(status.BAD_REQUEST);
  });

  it("Test case 400 | invalid types of values", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    const session = await createSession(createdUser.id, token);

    const credential: CredentialType = await createCredential(createdUser.id);

    const newCredential = {
      title: 123,
      url: null,
      username: true,
      password: undefined,
    };

    const result = await api
      .put(`/credential/${credential.id}`)
      .set("Authorization", `Bearer ${session.token}`)
      .send(newCredential);

    expect(result.status).toBe(status.BAD_REQUEST);
  });

  it("Test case 404 | non-existent credential", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    const session = await createSession(createdUser.id, token);

    const result = await api
      .put(`/credential/1`)
      .set("Authorization", `Bearer ${session.token}`)
      .send({});

    expect(result.status).toBe(status.NOT_FOUND);
  });

  it("Test case 401 | credential belongs other user", async () => {
    const createdUser: UserType = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id as number, fourHours);
    const session: SessionType = await createSession(
      createdUser.id as number,
      token
    );

    const auxUser: UserType = await createUser(
      "usuarioaxuliar@gmail.com",
      "senhadousuario"
    );

    const createdCredentialFromAuxUser: CredentialType = await createCredential(
      auxUser.id as number
    );

    const result = await api
      .put(`/credential/${createdCredentialFromAuxUser.id}`)
      .set("Authorization", `Bearer ${session.token}`)
      .send({});

    expect(result.status).toBe(status.UNAUTHORIZED);
  });

  it("Test case: 409 | title already used", async () => {
    const createdUser: UserType = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id as number, fourHours);
    const session: SessionType = await createSession(
      createdUser.id as number,
      token
    );

    const credential1: CredentialType = await createCredential(
      createdUser.id as number
    );

    const credential2: CredentialType = await createCredential(
      createdUser.id as number
    );

    const result = await api
      .put(`/credential/${credential2.id}`)
      .set("Authorization", `Bearer ${session.token}`)
      .send({ title: credential1.title });

    expect(result.status).toBe(status.CONFLICT);
  });

  it("Test case: 409 | url limited exceeded", async () => {
    const createdUser: UserType = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id as number, fourHours);
    const session: SessionType = await createSession(
      createdUser.id as number,
      token
    );

    for (let i = 0; i < 2; i++) {
      await createSpecificCredential(
        createdUser.id as number,
        `titulo${i + 1}`,
        "https://beta.openai.com/playground"
      );
    }

    const credential3: CredentialType = await createSpecificCredential(
      createdUser.id as number,
      `titulo3`,
      "https://www.youtube.com/"
    );

    const result = await api
      .put(`/credential/${credential3.id}`)
      .set("Authorization", `Bearer ${session.token}`)
      .send({
        url: "https://beta.openai.com/playground",
      });

    expect(result.status).toBe(status.CONFLICT);
  });

  it("Test case 200 | sucessfully", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    const session = await createSession(createdUser.id, token);

    const createdCredential: CredentialType = await createCredential(
      createdUser.id
    );

    const updatedCredential: CredentialUpdateType = {
      title: "titulo",
      url: "https://beta.openai.com/playground",
      username: "gomeshg",
      password: PASSWORD,
    };

    const result = await api
      .put(`/credential/${createdCredential.id}`)
      .set("Authorization", `Bearer ${session.token}`)
      .send(updatedCredential);

    expect(result.status).toBe(status.OK);
  });
});

describe("POST /network", () => {
  afterAll(async () => {
    await prisma.network.deleteMany();
    await prisma.credential.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  beforeEach(async () => {
    await prisma.network.deleteMany();
    await prisma.credential.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  it("Test case 400 | non-existent token ", async () => {
    const result = await api.post(`/network`).send({});

    expect(result.status).toBe(status.BAD_REQUEST);
  });

  it("Test case 401 | invalid token ", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    await createSession(createdUser.id, token);

    const result = await api
      .post(`/network`)
      .set("Authorization", `Bearer abcd-1234-efgh-5678`)
      .send({});

    expect(result.status).toBe(status.UNAUTHORIZED);
  });

  it("Test case 401 | expired token ", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, oneSecond);
    const session = await createSession(createdUser.id, token);

    await sleep(2000);

    const result = await api
      .post(`/network`)
      .set("Authorization", `Bearer ${session.token}`)
      .send({});

    expect(result.status).toBe(status.UNAUTHORIZED);
  });

  it("Test case 400 | invalid properties ", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    const session = await createSession(createdUser.id, token);

    const result = await api
      .post(`/network`)
      .set("Authorization", `Bearer ${session.token}`)
      .send({
        titulo: "errado",
        internet: "errada",
        senha: "errada",
      });

    expect(result.status).toBe(status.BAD_REQUEST);
  });

  it("Test case 400 | invalid types of values ", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    const session = await createSession(createdUser.id, token);

    const result = await api
      .post(`/network`)
      .set("Authorization", `Bearer ${session.token}`)
      .send({
        title: 3232,
        network: null,
        password: 1234,
        userId: undefined,
      });

    expect(result.status).toBe(status.BAD_REQUEST);
  });

  it("Test case 201 | sucessfully ", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    const session = await createSession(createdUser.id, token);

    const network = newNetwork(createdUser.id);

    const result = await api
      .post(`/network`)
      .set("Authorization", `Bearer ${session.token}`)
      .send(network);

    expect(result.status).toBe(status.CREATED);
  });
});

describe("GET /network", () => {
  afterAll(async () => {
    await prisma.network.deleteMany();
    await prisma.credential.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  beforeEach(async () => {
    await prisma.network.deleteMany();
    await prisma.credential.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  it("Test case 400 - getAll | non-existent token ", async () => {
    const result = await api.get(`/network`);

    expect(result.status).toBe(status.BAD_REQUEST);
  });

  it("Test case 401 - getAll | invalid token ", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    await createSession(createdUser.id, token);

    const result = await api
      .get(`/network`)
      .set("Authorization", `Bearer abcd-1234-efgh-5678`);

    expect(result.status).toBe(status.UNAUTHORIZED);
  });

  it("Test case 401 - getAll | expired token ", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, oneSecond);
    const session = await createSession(createdUser.id, token);

    await sleep(2000);

    const result = await api
      .get(`/network`)
      .set("Authorization", `Bearer ${session.token}`);

    expect(result.status).toBe(status.UNAUTHORIZED);
  });

  it("Test case 200 - getAll | sucessfully ", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    const session = await createSession(createdUser.id, token);

    const createdNetwork: NetworkType[] = [];

    for (let i = 0; i < 5; i++) {
      createdNetwork.push(await createNetwork(createdUser.id));
    }

    for (let j = 0; j < createdNetwork.length; j++) {
      createdNetwork[j].password = cryptr.decrypt(createdNetwork[j].password);
    }

    const result = await api
      .get(`/network`)
      .set("Authorization", `Bearer ${session.token}`);

    expect(result.status).toBe(status.OK);
    expect(result.body).toEqual(createdNetwork);
  });

  it("Test case 400 - getOne | non-existent token ", async () => {
    const result = await api.get(`/network/1`);

    expect(result.status).toBe(status.BAD_REQUEST);
  });

  it("Test case 401 - getOne | invalid token ", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    await createSession(createdUser.id, token);

    const result = await api
      .get(`/network/1`)
      .set("Authorization", `Bearer abcd-1234-efgh-5678`);

    expect(result.status).toBe(status.UNAUTHORIZED);
  });

  it("Test case 401 - getOne | expired token ", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, oneSecond);
    const session = await createSession(createdUser.id, token);

    await sleep(2000);

    const result = await api
      .get(`/network/1`)
      .set("Authorization", `Bearer ${session.token}`);

    expect(result.status).toBe(status.UNAUTHORIZED);
  });

  it("Test case 400 - getOne | invalid params ", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    const session = await createSession(createdUser.id, token);

    const result = await api
      .get(`/network/abc`)
      .set("Authorization", `Bearer ${session.token}`);

    expect(result.status).toBe(status.BAD_REQUEST);
  });

  it("Test case 404 - getOne | non-existent network ", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    const session = await createSession(createdUser.id, token);

    await createNetwork(createdUser.id);

    const result = await api
      .get(`/network/1`)
      .set("Authorization", `Bearer ${session.token}`);

    expect(result.status).toBe(status.NOT_FOUND);
  });

  it("Test case 401 - getOne | network belongs other user", async () => {
    const createdUser: UserType = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id as number, fourHours);
    const session: SessionType = await createSession(
      createdUser.id as number,
      token
    );

    const auxUser: UserType = await createUser(
      "usuarioaxuliar@gmail.com",
      "senhadousuario"
    );

    const createdNetworkFromAuxUser: NetworkType = await createNetwork(
      auxUser.id as number
    );

    const result = await api
      .get(`/network/${createdNetworkFromAuxUser.id}`)
      .set("Authorization", `Bearer ${session.token}`);

    expect(result.status).toBe(status.UNAUTHORIZED);
  });

  it("Test case 200 - getOne | sucessfully ", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    const session = await createSession(createdUser.id, token);

    const createdNetwork: NetworkType = await createNetwork(createdUser.id);
    createdNetwork.password = cryptr.decrypt(createdNetwork.password);

    const result = await api
      .get(`/network/${createdNetwork.id}`)
      .set("Authorization", `Bearer ${session.token}`);

    expect(result.status).toBe(status.OK);
    expect(result.body).toEqual(createdNetwork);
  });
});

describe("UPDATE /network", () => {
  afterAll(async () => {
    await prisma.network.deleteMany();
    await prisma.credential.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  beforeEach(async () => {
    await prisma.network.deleteMany();
    await prisma.credential.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  it("Test case 400 | non-existent token", async () => {
    const result = await api.put(`/network/1`).send({});

    expect(result.status).toBe(status.BAD_REQUEST);
  });

  it("Test case 401 | invalid token", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    await createSession(createdUser.id, token);

    const result = await api
      .put(`/network/1`)
      .set("Authorization", `Bearer 1234-abcd-5678-efgh`)
      .send({});

    expect(result.status).toBe(status.UNAUTHORIZED);
  });

  it("Test case 401 | expired token", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, oneSecond);
    const session = await createSession(createdUser.id, token);

    await sleep(2000);

    const result = await api
      .put(`/network/1`)
      .set("Authorization", `Bearer ${session.token}`)
      .send({});

    expect(result.status).toBe(status.UNAUTHORIZED);
  });

  it("Test case 400 | invalid params", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    const session = await createSession(createdUser.id, token);

    const result = await api
      .put(`/network/abc`)
      .set("Authorization", `Bearer ${session.token}`)
      .send({});

    expect(result.status).toBe(status.BAD_REQUEST);
  });

  it("Test case 400 | invalid properties", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    const session = await createSession(createdUser.id, token);

    const network: NetworkType = await createNetwork(createdUser.id);

    const newNetwork = {
      titulo: "errado",
      urlinda: "https://beta.openai.com/playground",
      nome: "nome",
      senha: "errada",
    };

    const result = await api
      .put(`/network/${network.id}`)
      .set("Authorization", `Bearer ${session.token}`)
      .send(newNetwork);

    expect(result.status).toBe(status.BAD_REQUEST);
  });

  it("Test case 400 | invalid types of values", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    const session = await createSession(createdUser.id, token);

    const network: NetworkType = await createNetwork(createdUser.id);

    const newNetwork = {
      title: 123,
      network: 123,
      password: undefined,
    };

    const result = await api
      .put(`/network/${network.id}`)
      .set("Authorization", `Bearer ${session.token}`)
      .send(newNetwork);

    expect(result.status).toBe(status.BAD_REQUEST);
  });

  it("Test case 404 | non-existent network", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    const session = await createSession(createdUser.id, token);

    const result = await api
      .put(`/network/1`)
      .set("Authorization", `Bearer ${session.token}`)
      .send({});

    expect(result.status).toBe(status.NOT_FOUND);
  });

  it("Test case 401 | network belongs other user", async () => {
    const createdUser: UserType = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id as number, fourHours);
    const session: SessionType = await createSession(
      createdUser.id as number,
      token
    );

    const auxUser: UserType = await createUser(
      "usuarioaxuliar@gmail.com",
      "senhadousuario"
    );

    const createdNetworkFromAuxUser: NetworkType = await createNetwork(
      auxUser.id as number
    );

    const result = await api
      .put(`/network/${createdNetworkFromAuxUser.id}`)
      .set("Authorization", `Bearer ${session.token}`)
      .send({});

    expect(result.status).toBe(status.UNAUTHORIZED);
  });

  it("Test case 200 | sucessfully", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    const session = await createSession(createdUser.id, token);

    const createdNetwork: NetworkType = await createNetwork(createdUser.id);

    const updatedNetwork: NetworkUpdateType = {
      title: "titulo",
      network: "network",
      password: "password",
    };

    const result = await api
      .put(`/network/${createdNetwork.id}`)
      .set("Authorization", `Bearer ${session.token}`)
      .send(updatedNetwork);

    expect(result.status).toBe(status.OK);
  });
});

describe("DELETE /network", () => {
  afterAll(async () => {
    await prisma.network.deleteMany();
    await prisma.credential.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  beforeEach(async () => {
    await prisma.network.deleteMany();
    await prisma.credential.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  it("Test case 400 | non-existent token", async () => {
    const result = await api.delete(`/network/1`);

    expect(result.status).toBe(status.BAD_REQUEST);
  });

  it("Test case 401 | invalid token", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    await createSession(createdUser.id, token);

    const result = await api
      .delete(`/network/1`)
      .set("Authorization", `Bearer 1234-abcd-5678-efgh`);

    expect(result.status).toBe(status.UNAUTHORIZED);
  });

  it("Test case 401 | expired token", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, oneSecond);
    const session = await createSession(createdUser.id, token);

    await sleep(2000);

    const result = await api
      .delete(`/network/1`)
      .set("Authorization", `Bearer ${session.token}`);

    expect(result.status).toBe(status.UNAUTHORIZED);
  });

  it("Test case 400 | invalid params", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    const session = await createSession(createdUser.id, token);

    const result = await api
      .delete(`/network/abc`)
      .set("Authorization", `Bearer ${session.token}`);

    expect(result.status).toBe(status.BAD_REQUEST);
  });

  it("Test case 404 | non-existent network", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    const session = await createSession(createdUser.id, token);

    const result = await api
      .delete(`/network/1`)
      .set("Authorization", `Bearer ${session.token}`);

    expect(result.status).toBe(status.NOT_FOUND);
  });

  it("Test case 401 | network belongs other user", async () => {
    const createdUser: UserType = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id as number, fourHours);
    const session: SessionType = await createSession(
      createdUser.id as number,
      token
    );

    const auxUser: UserType = await createUser(
      "usuarioaxuliar@gmail.com",
      "senhadousuario"
    );

    const createdNetworkFromAuxUser: NetworkType = await createNetwork(
      auxUser.id as number
    );

    const result = await api
      .delete(`/network/${createdNetworkFromAuxUser.id}`)
      .set("Authorization", `Bearer ${session.token}`);

    expect(result.status).toBe(status.UNAUTHORIZED);
  });

  it("Test case 200 | sucessfully", async () => {
    const createdUser = await createUser(EMAIL, PASSWORD);
    const token = createToken(createdUser.id, fourHours);
    const session = await createSession(createdUser.id, token);

    const createdNetwork: NetworkType = await createNetwork(createdUser.id);

    const result = await api
      .delete(`/network/${createdNetwork.id}`)
      .set("Authorization", `Bearer ${session.token}`);

    expect(result.status).toBe(status.OK);
  });
});

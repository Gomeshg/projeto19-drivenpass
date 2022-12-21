import status from "http-status";
import supertest from "supertest";
import server from "../src/main";
import prisma from "../src/database/database";

const api = supertest(server);

describe("POST /sign-up", () => {
  it("Test case: 400", async () => {
    const result = await api
      .post("/sign-up")
      .send({ nome: "Propriedade errada" });
    expect(result.status).toBe(status.BAD_REQUEST);
  });

  // it("Test case: 409", () => {});

  // it("Test case: 201", () => {});
});

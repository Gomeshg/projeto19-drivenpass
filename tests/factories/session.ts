import prisma from "../../src/database/database";

export default function createSession(userId: number, token: string) {
  return prisma.session.create({
    data: {
      userId: userId,
      token: token,
    },
  });
}

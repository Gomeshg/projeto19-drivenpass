// import prisma from "../database/database.js";
// import { SessionType } from "../protocols/types.js";
import prisma from "../database/database";
import { SessionType } from "../protocols/types";

async function createSession({ token, userId }: SessionType) {
  return prisma.session.upsert({
    where: {
      userId: userId,
    },
    create: {
      token: token,
      userId: userId,
    },
    update: {
      token: token,
    },
    select: {
      token: true,
    },
  });
}

async function searchSession(token: string | undefined) {
  return prisma.session.findUnique({
    where: {
      token: token,
    },
  });
}

const sessionRepository = {
  createSession,
  searchSession,
};

export default sessionRepository;

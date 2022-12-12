import prisma from "../database/database.js";

async function createSession(token: string, userId: number) {
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

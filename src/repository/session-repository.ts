import prisma from "../database/database.js";

async function insert(token: string, userId: number) {
  return prisma.session.create({
    data: {
      token: token,
      userId: userId,
    },
    select: {
      token: true,
    },
  });
}

async function search(token: string) {
  return prisma.session.findUnique({
    where: {
      token: token,
    },
  });
}

const sessionRepository = {
  insert,
  search,
};

export default sessionRepository;

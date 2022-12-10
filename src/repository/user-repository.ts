import prisma from "../database/database.js";

async function insert(email: string, password: string) {
  return prisma.user.create({
    data: {
      email: email,
      password: password,
    },
  });
}

async function search(email: string) {
  return prisma.user.findUnique({
    where: {
      email: email,
    },
  });
}

const userRepository = {
  insert,
  search,
};

export default userRepository;

import prisma from "../../src/database/database";
import bcrypt from "bcrypt";

export default async function createUser(email: string, password: string) {
  return prisma.user.create({
    data: {
      email: email,
      password: await bcrypt.hash(password, 12),
    },
  });
}

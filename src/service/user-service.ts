import userRepository from "../repository/user-repository.js";
import { UserType } from "../protocols/types.js";
import { conflictError, notFoundError } from "../erros/index-errors.js";
import bcrypt from "bcrypt";

async function insertUser({ email, password }: UserType) {
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await userRepository.search(email);

  if (user) {
    throw conflictError("User already exists");
  }

  return userRepository.insert(email, hashedPassword);
}

async function searchUser({ email: password }: UserType) {}

const userService = {
  insertUser,
  searchUser,
};

export default userService;

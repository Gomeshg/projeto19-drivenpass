import userRepository from "../repository/user-repository.js";
import sessionRepository from "../repository/session-repository.js";
import { UserType } from "../protocols/types.js";
import { conflictError, unauthorizedError } from "../erros/index-errors.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { secretKey, fourHours } from "../protocols/secretKey.js";

async function insertUser({ email, password }: UserType) {
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await userRepository.search(email);

  if (user) {
    throw conflictError("User already exists");
  }

  return userRepository.insert(email, hashedPassword);
}

async function loginUser({ email, password }: UserType) {
  const user = await userRepository.search(email);
  if (!user) {
    throw unauthorizedError();
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    throw unauthorizedError();
  }

  const token = jwt.sign({ userId: user.id }, secretKey, {
    expiresIn: fourHours,
  });

  return sessionRepository.createSession({ token: token, userId: user.id });
}

const userService = {
  insertUser,
  loginUser,
};

export default userService;

import { ApplicationError } from "../protocols/types";

export function badRequestError(): ApplicationError {
  return {
    name: "BadRequest",
    message: "Invalid request",
    status: 400,
  };
}

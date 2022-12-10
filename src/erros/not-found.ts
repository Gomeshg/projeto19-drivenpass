import { ApplicationError } from "../protocols/types.js";

export function notFoundError(): ApplicationError {
  return {
    name: "NotFoundError",
    message: "No result for this search!",
    status: 404,
  };
}

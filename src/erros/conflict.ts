import { ApplicationError } from "../protocols/types.js";

export function conflictError(message: string): ApplicationError {
  return {
    name: "ConflictError",
    message,
    status: 409,
  };
}

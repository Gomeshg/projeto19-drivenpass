import { ApplicationError } from "../protocols/types";

export function conflictError(message: string): ApplicationError {
  return {
    name: "ConflictError",
    message,
    status: 409,
  };
}

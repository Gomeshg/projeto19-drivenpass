import dotenv from "dotenv";

export function loadsEnvs() {
  let path = ".env";
  if (process.env.NODE_ENV === "test") {
    path = ".env.test";
  }
  dotenv.config({ path });
}

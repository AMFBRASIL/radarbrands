import { createRequire } from "node:module";
import { join } from "node:path";

type Argon2Module = typeof import("argon2");

let argon2Module: Argon2Module | null = null;

function loadArgon2(): Argon2Module {
  if (argon2Module) return argon2Module;
  const require = createRequire(join(process.cwd(), "package.json"));
  argon2Module = require("argon2") as Argon2Module;
  return argon2Module;
}

const PASSWORD_ALGO = "argon2id";

export async function hashPassword(password: string): Promise<string> {
  const argon2 = loadArgon2();
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  try {
    const argon2 = loadArgon2();
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

export function getPasswordAlgo(): string {
  return PASSWORD_ALGO;
}

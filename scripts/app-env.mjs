import { existsSync, readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
export const apiRoot = join(projectRoot, "src", "din_sat_api");
export const frontRoot = join(projectRoot, "src", "din_sat_front");

export function readAppEnv(root = projectRoot, inherited = process.env) {
  const env = {};
  // Keep API-only settings (session secret, origin, local test DB); Neon wins for its DB URLs.
  for (const relative of ["src/din_sat_api/.env", ".env", ".env.local"]) {
    const path = join(root, relative);
    if (existsSync(path))
      Object.assign(env, parseEnv(readFileSync(path, "utf8")));
  }
  return { ...env, ...inherited };
}

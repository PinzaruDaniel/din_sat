import { spawn } from "node:child_process";
import { apiRoot, readAppEnv } from "./app-env.mjs";

const action = process.argv[2] ?? "start";
const actions = {
  start: ["src/app/server.js"],
  dev: ["--watch", "src/app/server.js"],
  "db:migrate": ["scripts/database.js", "migrate"],
  "db:check": ["scripts/database.js", "check"],
};
if (!actions[action]) throw new Error("Unsupported API action.");
const child = spawn(process.execPath, actions[action], {
  cwd: apiRoot,
  env: readAppEnv(),
  stdio: "inherit",
});
child.on("error", () => {
  console.error("Could not start the API command.");
  process.exitCode = 1;
});
child.on("exit", (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0);
});
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));

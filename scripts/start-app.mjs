import { spawn } from "node:child_process";
import { readAppEnv, apiRoot, frontRoot } from "./app-env.mjs";

const dev = process.argv.includes("--dev");
const apiEnv = readAppEnv();
const frontPort = process.env.FRONTEND_PORT ?? "5173";
if (
  !/^\d+$/.test(frontPort) ||
  Number(frontPort) < 1 ||
  Number(frontPort) > 65535
)
  throw new Error("FRONTEND_PORT must be a valid port.");
const apiPort = apiEnv.PORT ?? "3001";
apiEnv.APP_ORIGIN ??= `http://localhost:${frontPort}`;
// The browser build receives no DATABASE_URL or session secret from the env files.
const frontendEnv = {
  ...process.env,
  API_PROXY_TARGET: `http://127.0.0.1:${apiPort}`,
};
const api = spawn(
  process.execPath,
  dev ? ["--watch", "src/app/server.js"] : ["src/app/server.js"],
  {
    cwd: apiRoot,
    env: apiEnv,
    stdio: "inherit",
  },
);
const frontend = spawn(
  process.execPath,
  [
    "node_modules/vite/bin/vite.js",
    ...(dev ? [] : ["preview"]),
    "--host",
    "127.0.0.1",
    "--port",
    frontPort,
    "--strictPort",
  ],
  { cwd: frontRoot, env: frontendEnv, stdio: "inherit" },
);
let stopping = false;
function stop(signal = "SIGTERM", code = 0) {
  if (stopping) return;
  stopping = true;
  process.exitCode = code;
  api.kill(signal);
  frontend.kill(signal);
}
for (const child of [api, frontend]) {
  child.on("error", () => {
    console.error("An application process could not start.");
    stop("SIGTERM", 1);
  });
  child.on("exit", (code) => {
    if (!stopping) stop("SIGTERM", code || 1);
  });
}
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => stop(signal));

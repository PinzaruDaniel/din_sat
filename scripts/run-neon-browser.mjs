import { spawn } from "node:child_process";
import { frontRoot } from "./app-env.mjs";

const child = spawn(
  process.execPath,
  ["node_modules/@playwright/test/cli.js", "test", "tests/e2e/neon.spec.js"],
  {
    cwd: frontRoot,
    env: { ...process.env, NEON_E2E: "true" },
    stdio: "inherit",
  },
);
child.on("exit", (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0);
});
child.on("error", () => {
  console.error("Could not start the Neon browser check.");
  process.exitCode = 1;
});
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));

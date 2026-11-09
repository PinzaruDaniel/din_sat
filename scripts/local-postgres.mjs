import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const local = join(root, ".local");
const data = join(local, "pgdata");
const action = process.argv[2] ?? "status";
if (!["start", "stop", "status"].includes(action))
  throw new Error("Usage: node scripts/local-postgres.mjs start|stop|status");
const candidates = [
  process.env.PG_BIN,
  "/opt/homebrew/opt/postgresql@18/bin",
  "/usr/local/opt/postgresql@18/bin",
];
const bin = candidates.find((path) => path && existsSync(join(path, "pg_ctl")));
const executable = (name) => (bin ? join(bin, name) : name);
function run(name, args, options = {}) {
  return spawnSync(executable(name), args, { encoding: "utf8", ...options });
}
function checked(name, args, options = {}) {
  const result = run(name, args, options);
  if (result.status !== 0)
    throw new Error(
      result.stderr || result.error?.message || `${name} failed.`,
    );
  if (result.stdout) console.info(result.stdout.trim());
}
const running = () =>
  existsSync(data) && run("pg_ctl", ["-D", data, "status"]).status === 0;
if (action === "status") {
  console.info(
    running()
      ? "DinSat PostgreSQL is running on local port 55432."
      : "DinSat PostgreSQL is stopped.",
  );
} else if (action === "stop") {
  if (running()) checked("pg_ctl", ["-D", data, "-m", "fast", "stop"]);
  else console.info("DinSat PostgreSQL is already stopped.");
} else {
  mkdirSync(local, { recursive: true, mode: 0o700 });
  const passwordFile = join(local, "postgres-password");
  if (!existsSync(passwordFile))
    writeFileSync(passwordFile, randomBytes(32).toString("hex") + "\n", {
      mode: 0o600,
    });
  if (!existsSync(join(data, "PG_VERSION")))
    checked("initdb", [
      "-D",
      data,
      "-U",
      "dinsat",
      "--auth-local=scram-sha-256",
      "--auth-host=scram-sha-256",
      `--pwfile=${passwordFile}`,
    ]);
  if (!running())
    checked("pg_ctl", [
      "-D",
      data,
      "-l",
      join(local, "postgres.log"),
      "-o",
      "-h 127.0.0.1 -p 55432 -k /private/tmp",
      "start",
    ]);
  const password = readFileSync(passwordFile, "utf8").trim();
  const env = { ...process.env, PGPASSWORD: password };
  const connection = ["-h", "127.0.0.1", "-p", "55432", "-U", "dinsat"];
  for (const name of ["dinsat", "dinsat_test"]) {
    const found = run(
      "psql",
      [
        ...connection,
        "-d",
        "postgres",
        "-Atc",
        `SELECT 1 FROM pg_database WHERE datname = '${name}'`,
      ],
      { env },
    );
    if (found.status !== 0)
      throw new Error(found.stderr || "Could not connect to local PostgreSQL.");
    if (found.stdout.trim() !== "1")
      checked("createdb", [...connection, name], { env });
  }
  const apiEnv = join(root, "src", "din_sat_api", ".env");
  if (!existsSync(apiEnv)) {
    writeFileSync(
      apiEnv,
      `PORT=3001\nHOST=127.0.0.1\nAPP_ORIGIN=http://localhost:5173\nSESSION_SECRET=${randomBytes(48).toString("hex")}\nDEMO_MODE=false\nNODE_ENV=development\nDATABASE_URL=postgresql://dinsat:${password}@127.0.0.1:55432/dinsat\nTEST_DATABASE_URL=postgresql://dinsat:${password}@127.0.0.1:55432/dinsat_test\nDB_POOL_MAX=5\n`,
      { mode: 0o600 },
    );
  }
  console.info(
    "Local databases dinsat and dinsat_test are ready. Existing API .env is preserved.",
  );
}

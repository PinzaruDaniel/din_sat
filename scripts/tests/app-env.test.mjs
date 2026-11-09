import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readAppEnv } from "../app-env.mjs";

test("Neon root env overrides local DB while preserving the API secret and explicit runtime overrides", () => {
  const root = mkdtempSync(join(tmpdir(), "dinsat-env-"));
  try {
    mkdirSync(join(root, "src/din_sat_api"), { recursive: true });
    writeFileSync(
      join(root, "src/din_sat_api/.env"),
      "DATABASE_URL=local-db\nSESSION_SECRET=api-only-secret\nTEST_DATABASE_URL=local-test\n",
    );
    writeFileSync(join(root, ".env"), "DATABASE_URL=root-db\n");
    writeFileSync(
      join(root, ".env.local"),
      "DATABASE_URL=neon-pooled\nDATABASE_URL_UNPOOLED=neon-direct\n",
    );
    const env = readAppEnv(root, { PORT: "3002" });
    assert.equal(env.DATABASE_URL, "neon-pooled");
    assert.equal(env.DATABASE_URL_UNPOOLED, "neon-direct");
    assert.equal(env.SESSION_SECRET, "api-only-secret");
    assert.equal(env.TEST_DATABASE_URL, "local-test");
    assert.equal(env.PORT, "3002");
    assert.equal(
      readAppEnv(root, { DATABASE_URL: "explicit-ci-db" }).DATABASE_URL,
      "explicit-ci-db",
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

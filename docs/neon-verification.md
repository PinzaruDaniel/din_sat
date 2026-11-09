# DinSat on Neon: verification

Project `late-cloud-11138544`, branch `production`. The Neon service is PostgreSQL; the Node API and React preview run locally. The local PostgreSQL database was not imported. The checks created uniquely named test accounts, products, pickup intervals and orders in the Neon database.

`npm i -g neon@latest` installed CLI 8.18.1. `neon init` wrote the project link and `neon.ts`. It initially linked offline; browser authentication completed during `neon deploy`.

```text
Auth complete (profile DEFAULT)
No changes — branch production already matches the policy.
Utilized services: Postgres
Pulled 3 Neon variables into .env.local
  Postgres        DATABASE_URL, DATABASE_URL_UNPOOLED
  Branch          NEON_BRANCH
```

The existing `pg` driver uses the pooled Neon URL for requests and sessions. The migration CLI uses the direct URL, and the pool explicitly verifies the server certificate and hostname for Neon URLs that omit `sslmode` or use `require`. Root startup loads the ignored Neon env file and preserves API settings such as the session secret. No connection strings appear in the output below.

```text
$ npm run db:migrate
Applied migrations: 001_initial.sql
$ npm run db:migrate
Database migrations are up to date.
$ npm run db:check
PostgreSQL connection and application tables are ready.

$ npm run build
✓ 1983 modules transformed.
✓ built in 3.30s

$ npm start
  ➜  Local:   http://127.0.0.1:5173/
DinSat API listening on port 3001 (PostgreSQL: persistent data).
```

```text
$ npm run test:neon:api
PASS API connected mode and PostgreSQL readiness
PASS producer and buyer registration uses durable repositories
PASS producer publishes product and pickup, buyer discovers both
PASS checkout total, stock reservation and idempotent replay
PASS authentication, ownership and buyer/producer permissions
PASS repeated cancellation restores stock and pickup once
PASS producer completes the full order lifecycle
```

After stopping and restarting `npm start`, with the same session secret:

```text
$ npm run test:neon:restart
PASS authenticated sessions survive API restart
PASS catalog and both order histories survive API restart
PASS logout revokes persisted sessions
SMOKE COMPLETE: connected PostgreSQL verified end to end. Named verification records remain; no database reset or seed was used.

$ npm run test:neon:browser
Running 1 test using 1 worker
✓ Neon PostgreSQL persists a real browser marketplace flow without demo seeds (16.1s)
1 passed (16.8s)
```

The first attempt to resume an earlier smoke run used a session that was no longer valid. A fresh smoke run followed by an immediate restart passed all three assertions. The temporary session file from verification was removed after the run. An earlier optional API suite run was rejected because automatic approval review had hit a usage limit. On retry, the standard API suite reported 21 passed, 0 failed, and 2 PostgreSQL test groups skipped because the standard command did not load the separate test database URL. The Neon end-to-end checks above ran against the connected cloud database.

import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const base = process.env.SMOKE_API_BASE ?? "http://127.0.0.1:3001/api/v1";
const origin = process.env.SMOKE_ORIGIN ?? "http://localhost:5173";
const statePath =
  process.env.SMOKE_STATE_FILE ?? "/private/tmp/dinsat-neon-smoke-state.json";
class Client {
  constructor(saved = {}) {
    this.cookies = { ...(saved.cookies ?? {}) };
    this.token = saved.token;
    this.user = saved.user;
  }
  async request(method, path, body, headers = {}, expected = 200) {
    const response = await fetch(base + path, {
      method,
      headers: {
        Origin: origin,
        ...(Object.keys(this.cookies).length
          ? {
              Cookie: Object.entries(this.cookies)
                .map(([key, value]) => `${key}=${value}`)
                .join("; "),
            }
          : {}),
        ...(this.token ? { "X-CSRF-Token": this.token } : {}),
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    for (const cookie of response.headers.getSetCookie()) {
      const pair = cookie.split(";", 1)[0];
      const split = pair.indexOf("=");
      this.cookies[pair.slice(0, split)] = pair.slice(split + 1);
    }
    let data;
    if (response.status !== 204) {
      try {
        data = await response.json();
      } catch {
        throw new Error(
          `${method} ${path}: expected JSON (${response.status})`,
        );
      }
    }
    assert.equal(
      response.status,
      expected,
      `${method} ${path}: ${response.status}, code=${data?.code ?? "none"}`,
    );
    if (data?.csrfToken) this.token = data.csrfToken;
    if (data?.user) this.user = data.user;
    return data;
  }
  save() {
    return { cookies: this.cookies, token: this.token, user: this.user };
  }
}
function pass(description) {
  console.info(`PASS ${description}`);
}
async function register(role, run) {
  const client = new Client();
  await client.request("GET", "/auth/session");
  await client.request(
    "POST",
    "/auth/register",
    {
      name:
        role === "buyer"
          ? "Neon verification buyer"
          : "Neon verification producer",
      email: `neon-${role}-${run}@example.md`,
      password: `NeonSmoke-${randomUUID()}!`,
      role,
    },
    {},
    201,
  );
  assert.equal(client.user.role, role);
  return client;
}

if (process.argv.includes("--resume")) {
  const state = JSON.parse(await readFile(statePath, "utf8"));
  const buyer = new Client(state.buyer);
  const producer = new Client(state.producer);
  const session = await buyer.request("GET", "/auth/session");
  assert.equal(session.user?.id, state.buyer.user.id);
  const producerSession = await producer.request("GET", "/auth/session");
  assert.equal(producerSession.user?.id, state.producer.user.id);
  pass("authenticated sessions survive API restart");
  const orders = await buyer.request("GET", "/orders");
  assert.equal(
    orders.items.find((order) => order.id === state.cancelledOrder)?.status,
    "cancelled",
  );
  assert.equal(
    orders.items.find((order) => order.id === state.completedOrder)?.status,
    "completed",
  );
  const product = await buyer.request("GET", `/products/${state.productId}`);
  assert.equal(product.availableQuantity, 3);
  pass("catalog and both order histories survive API restart");
  const old = new Client(buyer.save());
  await buyer.request("POST", "/auth/logout", undefined, {}, 204);
  await old.request("GET", "/orders", undefined, {}, 401);
  await producer.request("POST", "/auth/logout", undefined, {}, 204);
  pass("logout revokes persisted sessions");
  console.info(
    "SMOKE COMPLETE: connected PostgreSQL verified end to end. Named verification records remain; no database reset or seed was used.",
  );
} else {
  const run = randomUUID();
  const publicClient = new Client();
  const health = await publicClient.request("GET", "/health");
  assert.equal(health.mode, "connected");
  await publicClient.request("GET", "/ready");
  pass("API connected mode and PostgreSQL readiness");
  const producer = await register("producer", run);
  const buyer = await register("buyer", run);
  pass("producer and buyer registration uses durable repositories");
  const product = await producer.request(
    "POST",
    "/products",
    {
      title: `Neon smoke ${run.slice(0, 8)}`,
      description:
        "Verification-only product created by the Neon setup smoke test.",
      category: "legume",
      unit: "buc",
      priceAmount: "12.50",
      availableQuantity: 4,
      imageUrl: "https://example.com/neon-verification-product.jpg",
    },
    {},
    201,
  );
  assert.equal(product.producerId, producer.user.id);
  const startsAt = new Date(Date.now() + 2 * 86400000);
  const slot = await producer.request(
    "POST",
    "/pickup-slots",
    {
      startsAt: startsAt.toISOString(),
      endsAt: new Date(startsAt.getTime() + 3600000).toISOString(),
      location: "Neon setup verification pickup, Chisinau",
      capacity: 2,
    },
    {},
    201,
  );
  assert.equal(slot.producerId, producer.user.id);
  const listing = await publicClient.request(
    "GET",
    `/products?producerId=${producer.user.id}`,
  );
  assert.equal(
    listing.items.some((entry) => entry.id === product.id),
    true,
  );
  const readSlots = await buyer.request(
    "GET",
    `/pickup-slots?producerId=${producer.user.id}`,
  );
  assert.equal(
    readSlots.items.some((entry) => entry.id === slot.id),
    true,
  );
  pass("producer publishes product and pickup, buyer discovers both");
  const input = {
    items: [{ productId: product.id, quantity: 2 }],
    pickupSlotId: slot.id,
  };
  const key = `neon-${randomUUID()}`;
  const first = await buyer.request(
    "POST",
    "/orders",
    input,
    { "Idempotency-Key": key },
    201,
  );
  const replay = await buyer.request(
    "POST",
    "/orders",
    input,
    { "Idempotency-Key": key },
    201,
  );
  assert.equal(first.id, replay.id);
  assert.equal(first.totalAmount, "25.00");
  await buyer.request(
    "POST",
    "/orders",
    { ...input, items: [{ productId: product.id, quantity: 1 }] },
    { "Idempotency-Key": key },
    409,
  );
  assert.equal(
    (await publicClient.request("GET", `/products/${product.id}`))
      .availableQuantity,
    2,
  );
  pass("checkout total, stock reservation and idempotent replay");
  await publicClient.request("GET", "/orders", undefined, {}, 401);
  await buyer.request(
    "PATCH",
    `/orders/${first.id}/status`,
    { status: "confirmed" },
    {},
    403,
  );
  const received = await producer.request("GET", "/orders");
  assert.equal(
    received.items.some((entry) => entry.id === first.id),
    true,
  );
  pass("authentication, ownership and buyer/producer permissions");
  await buyer.request("PATCH", `/orders/${first.id}/status`, {
    status: "cancelled",
  });
  await buyer.request("PATCH", `/orders/${first.id}/status`, {
    status: "cancelled",
  });
  assert.equal(
    (await publicClient.request("GET", `/products/${product.id}`))
      .availableQuantity,
    4,
  );
  const afterCancel = await buyer.request(
    "GET",
    `/pickup-slots?producerId=${producer.user.id}`,
  );
  assert.equal(
    afterCancel.items.find((entry) => entry.id === slot.id).capacity,
    2,
  );
  pass("repeated cancellation restores stock and pickup once");
  const completed = await buyer.request(
    "POST",
    "/orders",
    { ...input, items: [{ productId: product.id, quantity: 1 }] },
    { "Idempotency-Key": `neon-${randomUUID()}` },
    201,
  );
  for (const status of ["confirmed", "preparing", "ready", "completed"]) {
    assert.equal(
      (
        await producer.request("PATCH", `/orders/${completed.id}/status`, {
          status,
        })
      ).status,
      status,
    );
  }
  pass("producer completes the full order lifecycle");
  await writeFile(
    statePath,
    JSON.stringify({
      buyer: buyer.save(),
      producer: producer.save(),
      productId: product.id,
      cancelledOrder: first.id,
      completedOrder: completed.id,
    }),
    { mode: 0o600 },
  );
  console.info(
    "SMOKE STAGE 1 COMPLETE: restart the same API with the same SESSION_SECRET, then run this script with --resume.",
  );
}

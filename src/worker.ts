/**
 * Corvid Cloud Worker
 * Routes API requests to Pet Durable Objects.
 */

import { Pet } from "./pet";

export { Pet };

interface Env {
  PET: DurableObjectNamespace;
  SHARED_SECRET?: string;
}

function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function json(data: unknown, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}

function errorResponse(message: string, status: number): Response {
  return json({ error: message }, status);
}

function checkAuth(request: Request, env: Env): boolean {
  if (!env.SHARED_SECRET) return true; // no auth configured
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) return false;
  return authHeader === `Bearer ${env.SHARED_SECRET}`;
}

function getPetStub(env: Env, petId: string) {
  const id = env.PET.idFromName(petId);
  return env.PET.get(id) as any;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    // --- Public routes (no auth) ---

    // Health check
    if (pathname === "/health") {
      return json({ status: "ok", service: "corvid-cloud" });
    }

    // --- Protected routes ---
    if (!checkAuth(request, env)) {
      return errorResponse("Unauthorized", 401);
    }

    // Create/init pet: POST /pet/:id/init { name }
    const initMatch = pathname.match(/^\/pet\/([^/]+)\/init$/);
    if (initMatch && request.method === "POST") {
      const petId = initMatch[1];
      const body = await request.json() as { name?: string; speciesId?: string };
      const stub = getPetStub(env, petId);
      const result = await stub.initialize(body.name ?? "unnamed", body.speciesId);
      return json(result);
    }

    // Get status: GET /pet/:id/status
    const statusMatch = pathname.match(/^\/pet\/([^/]+)\/status$/);
    if (statusMatch && request.method === "GET") {
      const petId = statusMatch[1];
      const stub = getPetStub(env, petId);
      const status = await stub.getStatus();
      return json(status);
    }

    // Interact: POST /pet/:id/interact { action }
    const interactMatch = pathname.match(/^\/pet\/([^/]+)\/interact$/);
    if (interactMatch && request.method === "POST") {
      const petId = interactMatch[1];
      const body = await request.json() as { action: string };
      if (!body.action) return errorResponse("Missing 'action' field", 400);
      const stub = getPetStub(env, petId);
      const result = await stub.interact(body.action);
      return json(result);
    }

    // Play specific: POST /pet/:id/play { type }
    const playMatch = pathname.match(/^\/pet\/([^/]+)\/play$/);
    if (playMatch && request.method === "POST") {
      const petId = playMatch[1];
      const body = await request.json() as { type?: string };
      const stub = getPetStub(env, petId);
      const result = await stub.playSpecific(body.type ?? "chase");
      return json(result);
    }

    // Gift: POST /pet/:id/gift { content, giver? }
    const giftMatch = pathname.match(/^\/pet\/([^/]+)\/gift$/);
    if (giftMatch && request.method === "POST") {
      const petId = giftMatch[1];
      const body = await request.json() as { content: string; giver?: string };
      if (!body.content) return errorResponse("Missing 'content' field", 400);
      const stub = getPetStub(env, petId);
      const result = await stub.receiveGift(body.content, body.giver ?? "human");
      return json(result);
    }

    // Trade: POST /pet/:id/trade { offering }
    const tradeMatch = pathname.match(/^\/pet\/([^/]+)\/trade$/);
    if (tradeMatch && request.method === "POST") {
      const petId = tradeMatch[1];
      const body = await request.json() as { offering: string };
      if (!body.offering) return errorResponse("Missing 'offering' field", 400);
      const stub = getPetStub(env, petId);
      const result = await stub.proposeTrade(body.offering);
      return json(result);
    }

    // Get collection: GET /pet/:id/collection
    const collectionMatch = pathname.match(/^\/pet\/([^/]+)\/collection$/);
    if (collectionMatch && request.method === "GET") {
      const petId = collectionMatch[1];
      const stub = getPetStub(env, petId);
      const items = await stub.getCollection();
      return json({ items, count: items.length });
    }

    // Force tick: POST /pet/:id/tick
    const tickMatch = pathname.match(/^\/pet\/([^/]+)\/tick$/);
    if (tickMatch && request.method === "POST") {
      const petId = tickMatch[1];
      const stub = getPetStub(env, petId);
      const events = await stub.tick(1);
      return json({ events });
    }

    return errorResponse("Not found", 404);
  },
};

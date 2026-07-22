import { DEFAULT_CONTENT, resolveContent } from "../src/lib/siteContent.js";

export const CONTENT_KEY = process.env.SUPABASE_CONTENT_KEY || "landing";
export const CONTENT_TABLE = process.env.SUPABASE_CONTENT_TABLE || "site_content";
export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "site-assets";

export function hasSupabaseConfig() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function requireAdmin(req) {
  const password = process.env.CMS_ADMIN_PASSWORD;
  if (!password) {
    return {
      ok: false,
      status: 503,
      error: "CMS_ADMIN_PASSWORD is missing in Vercel environment variables.",
    };
  }

  const header = req.headers.authorization || "";
  if (header !== `Bearer ${password}`) {
    return { ok: false, status: 401, error: "Invalid CMS password." };
  }

  return { ok: true };
}

export async function readContentRow() {
  if (!hasSupabaseConfig()) {
    return { content: resolveContent(DEFAULT_CONTENT), source: "default", configured: false };
  }

  const response = await supabaseFetch(`/rest/v1/${CONTENT_TABLE}?key=eq.${encodeURIComponent(CONTENT_KEY)}&select=value,updated_at`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(await supabaseError(response, "Could not read site_content."));
  }

  const rows = await response.json();
  const row = Array.isArray(rows) ? rows[0] : null;
  return {
    content: resolveContent(row?.value || DEFAULT_CONTENT),
    source: row ? "supabase" : "default",
    configured: true,
    updatedAt: row?.updated_at || null,
  };
}

export async function upsertContentRow(content) {
  if (!hasSupabaseConfig()) {
    throw new Error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in Vercel environment variables.");
  }

  const value = resolveContent(content || DEFAULT_CONTENT);
  const response = await supabaseFetch(`/rest/v1/${CONTENT_TABLE}?on_conflict=key`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify({
      key: CONTENT_KEY,
      value,
      updated_at: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error(await supabaseError(response, "Could not save site_content."));
  }

  const rows = await response.json();
  return resolveContent(rows?.[0]?.value || value);
}

export async function ensureStorageBucket() {
  if (!hasSupabaseConfig()) {
    throw new Error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in Vercel environment variables.");
  }

  const current = await supabaseFetch(`/storage/v1/bucket/${encodeURIComponent(STORAGE_BUCKET)}`, {
    method: "GET",
  });

  if (current.ok) {
    const bucket = await current.json().catch(() => null);
    if (bucket && bucket.public === false) {
      await supabaseFetch(`/storage/v1/bucket/${encodeURIComponent(STORAGE_BUCKET)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public: true, file_size_limit: null, allowed_mime_types: null }),
      });
    }
    return;
  }

  if (current.status !== 404) {
    throw new Error(await supabaseError(current, "Could not inspect storage bucket."));
  }

  const created = await supabaseFetch("/storage/v1/bucket", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: STORAGE_BUCKET,
      name: STORAGE_BUCKET,
      public: true,
      file_size_limit: null,
      allowed_mime_types: null,
    }),
  });

  if (!created.ok && created.status !== 409) {
    throw new Error(await supabaseError(created, "Could not create storage bucket."));
  }
}

export async function uploadObject(path, contentType, body) {
  const response = await supabaseFetch(`/storage/v1/object/${STORAGE_BUCKET}/${encodePath(path)}`, {
    method: "POST",
    headers: {
      "Cache-Control": "31536000",
      "Content-Type": contentType,
      "x-upsert": "true",
    },
    body,
  });

  if (!response.ok) {
    throw new Error(await supabaseError(response, "Could not upload asset."));
  }

  return {
    path,
    url: `${baseUrl()}/storage/v1/object/public/${STORAGE_BUCKET}/${encodePath(path)}`,
  };
}

export async function parseJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}

export function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

async function supabaseFetch(path, options = {}) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return fetch(`${baseUrl()}${path}`, {
    ...options,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      ...(options.headers || {}),
    },
  });
}

async function supabaseError(response, fallback) {
  try {
    const payload = await response.json();
    return payload.message || payload.error || fallback;
  } catch {
    return fallback;
  }
}

function baseUrl() {
  return String(process.env.SUPABASE_URL || "").replace(/\/$/, "");
}

function encodePath(path) {
  return String(path).split("/").map(encodeURIComponent).join("/");
}

import { randomUUID } from "node:crypto";
import { ensureStorageBucket, json, parseJsonBody, requireAdmin, uploadObject } from "../../server/supabaseApi.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return json(res, 405, { error: "Method not allowed." });
    }

    const admin = requireAdmin(req);
    if (!admin.ok) return json(res, admin.status, { error: admin.error });

    const body = await parseJsonBody(req);
    const fileName = sanitizeFileName(body.fileName || "asset");
    const contentType = body.contentType || contentTypeFromName(fileName);
    const data = String(body.dataUrl || "").replace(/^data:[^;]+;base64,/, "");

    if (!data) return json(res, 400, { error: "Missing asset data." });

    await ensureStorageBucket();

    const buffer = Buffer.from(data, "base64");
    const path = `cms/${Date.now()}-${randomUUID()}-${fileName}`;
    const uploaded = await uploadObject(path, contentType, buffer);

    return json(res, 200, uploaded);
  } catch (error) {
    return json(res, 500, { error: error.message || "CMS asset API failed." });
  }
}

function sanitizeFileName(fileName) {
  const safe = String(fileName)
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return safe || "asset";
}

function contentTypeFromName(fileName) {
  if (/\.png$/i.test(fileName)) return "image/png";
  if (/\.webp$/i.test(fileName)) return "image/webp";
  if (/\.gif$/i.test(fileName)) return "image/gif";
  if (/\.svg$/i.test(fileName)) return "image/svg+xml";
  return "image/jpeg";
}

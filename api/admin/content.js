import { json, parseJsonBody, readContentRow, requireAdmin, upsertContentRow } from "../../server/supabaseApi.js";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const result = await readContentRow();
      return json(res, 200, result);
    }

    if (req.method === "PUT") {
      const admin = requireAdmin(req);
      if (!admin.ok) return json(res, admin.status, { error: admin.error });

      const body = await parseJsonBody(req);
      const content = await upsertContentRow(body.content || body.value || body);
      return json(res, 200, { content, source: "supabase" });
    }

    res.setHeader("Allow", "GET, PUT");
    return json(res, 405, { error: "Method not allowed." });
  } catch (error) {
    return json(res, 500, { error: error.message || "CMS content API failed." });
  }
}

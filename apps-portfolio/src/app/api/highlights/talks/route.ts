import { getDb } from "../../../../lib/db";

export async function GET() {
  const db = await getDb();
  const talks = await db.all("SELECT * FROM talks WHERE tags LIKE '%highlight%'");
  return new Response(JSON.stringify(talks), {
    headers: { "Content-Type": "application/json" },
  });
}

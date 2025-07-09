import { getDb } from "../../../../lib/db";

export async function GET() {
  const db = await getDb();
  const articles = await db.all("SELECT * FROM articles WHERE tags LIKE '%highlight%'");
  return new Response(JSON.stringify(articles), {
    headers: { "Content-Type": "application/json" },
  });
}

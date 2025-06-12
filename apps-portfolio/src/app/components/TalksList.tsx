
import { getDb } from "../../lib/db";

async function getTalks() {
  const db = await getDb();
  const talks = await db.all("SELECT * FROM talks ORDER BY date DESC");
  return talks;
}

export default async function TalksList() {
  const talks = await getTalks();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Talks</h2>
      <ul>
        {talks.map((talk) => (
          <li key={talk.id} className="mb-4">
            <h3 className="text-xl font-semibold">{talk.title}</h3>
            <p className="text-gray-600">{talk.event} - {talk.location} ({talk.date})</p>
            {talk.tags && (
              <div className="flex gap-2 mt-2">
                {talk.tags.split(",").map((tag: string) => (
                  <span key={tag} className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

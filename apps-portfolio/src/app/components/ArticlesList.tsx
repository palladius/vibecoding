
import { getDb } from "../../lib/db";

async function getArticles() {
  const db = await getDb();
  const articles = await db.all("SELECT * FROM articles ORDER BY publish_date DESC");
  return articles;
}

export default async function ArticlesList() {
  const articles = await getArticles();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Articles</h2>
      <ul>
        {articles.map((article) => (
          <li key={article.id} className="mb-4">
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-xl font-semibold hover:underline">
              {article.title}
            </a>
            <p className="text-gray-600">{article.publish_date}</p>
            {article.tags && (
              <div className="flex gap-2 mt-2">
                {article.tags.split(",").map((tag: string) => (
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

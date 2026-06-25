import { getArticles } from "../lib/data";
import ViewSwitcher from "../components/ViewSwitcher";
import { Article } from "../../lib/types";

export default async function VideosPage() {
  const allArticles = await getArticles();
  
  // Filter for video resources only
  const videos = allArticles
    .filter((article: Article) => article.resource_type === 'video')
    .sort((a: Article, b: Article) => {
      // Sort by relevance (descending) first
      const relA = a.relevance ?? 0;
      const relB = b.relevance ?? 0;
      if (relB !== relA) {
        return relB - relA;
      }
      // Then sort by publish date descending
      const dateA = a.publish_date ?? '';
      const dateB = b.publish_date ?? '';
      return dateB.localeCompare(dateA);
    });

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-2 mb-4">
          <h1 className="text-4xl font-bold text-yellow-400">📹 Videos</h1>
          <p className="text-gray-400 text-center max-w-xl">
            A curated collection of talks, outage investigations, and conference highlights.
          </p>
        </div>
        <ViewSwitcher items={videos} />
      </main>
    </div>
  );
}

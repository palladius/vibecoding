import { getArticles } from "../lib/data";
import { Article } from "../../lib/types";
import ViewSwitcher from "../components/ViewSwitcher";

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-16">
        <ViewSwitcher items={articles} />
      </main>
    </div>
  );
}
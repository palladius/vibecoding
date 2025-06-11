import TalksList from "./components/TalksList";
import ArticlesList from "./components/ArticlesList";

export default function Home() {
  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-16">
        <h1 className="text-4xl font-bold text-center">Riccardo Carlesso's Portfolio</h1>
        <TalksList />
        <ArticlesList />
      </main>
    </div>
  );
}

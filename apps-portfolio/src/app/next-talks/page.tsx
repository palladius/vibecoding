import { getFutureTalks } from "../lib/data";
import NextTalksClientPage from "./NextTalksClientPage";

export const dynamic = "force-dynamic";

export default async function NextTalksPage() {
  const talks = await getFutureTalks();

  return <NextTalksClientPage initialTalks={talks} />;
}


import { getFutureTalks } from "../lib/data";
import NextTalksClientPage from "./NextTalksClientPage";

export default async function NextTalksPage() {
  const talks = await getFutureTalks();

  return <NextTalksClientPage initialTalks={talks} />;
}

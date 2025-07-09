import { getTalks } from "../lib/data";
import TalksClientPage from "./TalksClientPage";

export default async function TalksPage() {
  const talks = await getTalks();

  return <TalksClientPage talks={talks} />;
}

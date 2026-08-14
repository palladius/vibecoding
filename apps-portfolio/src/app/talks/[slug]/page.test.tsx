// src/app/talks/[slug]/page.test.tsx
import { getTalk } from '../../lib/data';

describe('TalkPage', () => {
  it('should return a talk for a valid slug', async () => {
    const talk = await getTalk('2025-11-08-agenti-in-volo-unanalisi-approfondita-sulla-creazione-di-un-agente-di-viaggio-in-tempo-reale');
    expect(talk).toBeDefined();
    expect(talk?.title).toBe("Agenti in Volo: Un'Analisi Approfondita sulla Creazione di un Agente di Viaggio in Tempo Reale ✈️");
  });

  it('should return undefined for an invalid slug', async () => {
    const talk = await getTalk('invalid-slug');
    expect(talk).toBeUndefined();
  });
});
import { getTalk, getFutureTalks } from "./data";
import { describe, it, expect } from "vitest";

describe("getTalk Integration", () => {
  it('should find the "Beyond Blame" talk', async () => {
    const slug = "2025-10-14-beyond-blame-the-art-of-the-postmortem";
    const talk = await getTalk(slug);
    expect(talk).toBeDefined();
    expect(talk?.title).toBe("Beyond Blame: The Art of the Postmortem");
  });

  it("getFutureTalks() should never return any event in the past (like 2026-05-08 Rubycon) and should return upcoming talks", async () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const futureTalks = await getFutureTalks();

    expect(futureTalks.every((t) => t.date >= todayStr)).toBe(true);
    for (const talk of futureTalks) {
      expect(talk.date >= todayStr).toBe(true);
      expect(talk.status).not.toBe("delivered");
      expect(talk.date).not.toBe("2026-05-08");
      expect(talk.title).not.toContain("Rubycon Italy 2026");
    }

    if (todayStr <= "2026-10-20") {
      const events = futureTalks.map((t) => t.event);
      expect(events).toContain("Google Cloud AI Live + Labs Zurich 2026");
      expect(events).toContain("SREday Warsaw 2026 Q4");
      expect(events).toContain("Codemotion Milan 2026");
      expect(events).toContain("DevFest Prague 2026 (DevFest.cz)");
    }
  });
});


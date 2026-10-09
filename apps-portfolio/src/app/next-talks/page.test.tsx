import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import moment from "moment";
import NextTalksClientPage from "./NextTalksClientPage";
import * as NextTalksPageModule from "./page";
import { Talk } from "../../lib/types";

describe("Next Talks — Never Feature Past Events relative to NOW() (TDD)", () => {
  const yesterdayStr = moment().subtract(1, "days").format("YYYY-MM-DD");
  const tomorrowStr = moment().add(1, "days").format("YYYY-MM-DD");
  const nextMonthStr = moment().add(30, "days").format("YYYY-MM-DD");

  const sampleTalks: Talk[] = [
    {
      id: 1,
      title: "Welcome to Rubycon Italy 2026 (Opening Keynote)",
      event: "Rubycon Italy 2026",
      date: "2026-05-08",
      location: "Rimini, Italy",
      country_code: "it",
      status: "confirmed",
      tags: "Ruby,Keynote,Rimini,Italy,MC",
      image: "/images/events/rubycon-2026.png",
      slug: "2026-05-08-welcome-to-rubycon-italy-2026-opening-keynote",
    },
    {
      id: 2,
      title: "Yesterday Past Talk That Must Be Hidden",
      event: "Yesterday Conf",
      date: yesterdayStr,
      location: "Modena, Italy",
      country_code: "it",
      status: "confirmed",
      tags: "Keynote,AI,Modena,Italy",
      image: "/images/events/devfest-modena-2025.png",
      slug: `${yesterdayStr}-yesterday-past-talk`,
    },
    {
      id: 3,
      title: "Stop Grepping, Start Reasoning: Skill-Based Agentic SRE 🐉",
      event: "SREday Warsaw 2026 Q4",
      date: tomorrowStr,
      location: "Warsaw, Poland",
      country_code: "pl",
      status: "confirmed",
      tags: "SRE,AI,Warsaw,Poland",
      image: "/images/events/SREDAY-2024.png",
      slug: `${tomorrowStr}-stop-grepping-start-reasoning-skill-based-agentic-sre`,
    },
    {
      id: 4,
      title: "The Day I Left My Linux Machine Running: A Love Story with OpenClaw 🦞, Hermes 🪽 & Antigravity",
      event: "DevFest Prague 2026 (DevFest.cz)",
      date: nextMonthStr,
      location: "Prague, Czech Republic",
      country_code: "cz",
      status: "confirmed",
      tags: "AI,OpenClaw,Hermes,Antigravity,DevFest,Prague",
      image: "/images/events/devfest-pescara-2025.png",
      slug: `${nextMonthStr}-the-day-i-left-my-linux-machine-running`,
    },
  ];

  it("forces dynamic server rendering on /next-talks so Docker build never freezes new Date() at deploy time", () => {
    expect((NextTalksPageModule as Record<string, unknown>).dynamic).toBe("force-dynamic");
  });

  it("evaluates NOW() at runtime and never renders past talks (2026-05-08 Rubycon or yesterday)", () => {
    render(<NextTalksClientPage initialTalks={sampleTalks} />);

    // Past events relative to NOW() MUST NEVER appear in Next Talks
    expect(
      screen.queryByText(/Welcome to Rubycon Italy 2026/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Yesterday Past Talk That Must Be Hidden/i)
    ).not.toBeInTheDocument();

    // Upcoming events relative to NOW() MUST appear in Next Talks
    expect(screen.getByText(/SREday Warsaw 2026 Q4/i)).toBeInTheDocument();
    expect(screen.getByText(/DevFest Prague 2026/i)).toBeInTheDocument();
  });
});

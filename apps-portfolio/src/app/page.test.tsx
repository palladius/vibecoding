import { render, screen } from "@testing-library/react";
import Home from "./page";
import { vi } from 'vitest';

vi.mock('./lib/data', () => ({
  getTalks: () => Promise.resolve([]),
  getArticles: () => Promise.resolve([]),
  getHighlightedTalks: () => Promise.resolve([]),
  getHighlightedArticles: () => Promise.resolve([]),
}));

describe("Home", () => {
  it("renders the main container", async () => {
    const HomeResolved = await Home();
    render(HomeResolved);
    expect(screen.getByTestId("home-container")).toBeInTheDocument();
  });
});

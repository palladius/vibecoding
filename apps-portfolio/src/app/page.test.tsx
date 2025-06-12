import { render, screen } from "@testing-library/react";
import Home from "./page";
import { vi } from 'vitest';

vi.mock('./lib/data', () => ({
  getTalks: () => Promise.resolve([]),
  getArticles: () => Promise.resolve([]),
}));

describe("Home", () => {
  it("renders the heading", async () => {
    const homeElement = await Home();
    render(homeElement);
    const heading = await screen.findByText(/Riccardo Carlesso's Portfolio/i);
    expect(heading).toBeInTheDocument();
  });
});
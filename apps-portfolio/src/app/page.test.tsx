import { render, screen, act } from "@testing-library/react";
import Home from "./page";
import { vi } from 'vitest';

vi.mock('./lib/data', () => ({
  getTalks: () => Promise.resolve([]),
  getArticles: () => Promise.resolve([]),
}));

describe("Home", () => {
  it("renders the heading", async () => {
    await act(async () => {
      render(<Home />);
    });
    const itemsListContainer = screen.getByTestId('home-container');
    expect(itemsListContainer).toBeInTheDocument();
  });
});

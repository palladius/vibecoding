import { render, screen } from "@testing-library/react";
import Home from "./page";
import { vi } from 'vitest';

vi.mock('./lib/data', () => ({
  getTalks: () => Promise.resolve([]),
  getArticles: () => Promise.resolve([]),
}));

describe("Home", () => {
  it("renders the heading", async () => {
    render(<Home />);
    const itemsListContainer = screen.getByTestId('items-list-container');
    expect(itemsListContainer).toBeInTheDocument();
  });
});
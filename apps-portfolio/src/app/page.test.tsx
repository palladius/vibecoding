import { render, screen, waitFor } from "@testing-library/react";
import Home from "./page";
import { vi } from 'vitest';
import React from "react";

vi.mock('./lib/data', () => ({
  getTalks: () => Promise.resolve([]),
  getArticles: () => Promise.resolve([]),
}));

vi.mock('./components/ViewSwitcher', () => ({
  default: () => <div>ViewSwitcher</div>,
}));

describe("Home", () => {
  it("renders the heading", async () => {
    const HomeAsAny = Home as any;
    render(
      <React.Suspense fallback={<div>Loading...</div>}>
        <HomeAsAny />
      </React.Suspense>
    );
    await waitFor(() => {
      const itemsListContainer = screen.getByTestId('home-container');
      expect(itemsListContainer).toBeInTheDocument();
    });
  });
});

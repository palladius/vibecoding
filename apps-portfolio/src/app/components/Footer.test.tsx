import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer", () => {
  it("renders the footer", () => {
    render(<Footer appName="Test App" version="1.0.0" repoUrl="https://github.com/test/app" />);
    const appName = screen.getByText(/Test App/i);
    expect(appName).toBeInTheDocument();
  });
});

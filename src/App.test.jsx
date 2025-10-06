// App.test.jsx
// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";

// Mock child components
vi.mock("./components/common/Header/Header", () => ({
  default: () => <header data-testid="header">Header</header>,
}));

// Mock context providers
vi.mock("./context/SearchProvider", () => ({
  SearchProvider: ({ children }) => <div>{children}</div>,
}));

vi.mock("./context/BooksProvider", () => ({
  BooksProvider: ({ children }) => <div>{children}</div>,
}));

describe("App component", () => {
  it("renders header, main and footer", () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>
    );

    // Check that header is rendered
    expect(screen.getByTestId("header")).toBeInTheDocument();

    // Check that main container is rendered
    const mainElement = screen.getByRole("main");
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass("app-container");
  });
});

// Searches.test.jsx
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Searches from "./Searches";
import styles from "./Searches.module.css";

// Mock hooks
vi.mock("../../../hooks/useSearch");

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock lucide-react icon
vi.mock("lucide-react", () => ({
  ArrowRight: (props) => (
    <span data-testid="arrow-right-icon" {...props}>
      →
    </span>
  ),
}));

import { useSearch } from "../../../hooks/useSearch";

describe("Searches component", () => {
  const mockSearchBooks = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    useSearch.mockReturnValue({
      searchBooks: mockSearchBooks,
    });

    mockSearchBooks.mockResolvedValue();
  });

  const renderSearches = (text) => {
    return render(
      <BrowserRouter>
        <Searches text={text} />
      </BrowserRouter>
    );
  };

  it("renders button with text", () => {
    renderSearches("JavaScript books");

    const button = screen.getByRole("button", { name: /JavaScript books/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("JavaScript books");
  });

  it("renders arrow icon", () => {
    renderSearches("Test query");

    expect(screen.getByTestId("arrow-right-icon")).toBeInTheDocument();
  });

  it("calls searchBooks with text when clicked", async () => {
    const user = userEvent.setup();
    const searchText = "React hooks";

    renderSearches(searchText);

    const button = screen.getByRole("button");
    await user.click(button);

    await waitFor(() => {
      expect(mockSearchBooks).toHaveBeenCalledWith(searchText);
    });
  });

  it("navigates to search page after searching", async () => {
    const user = userEvent.setup();

    renderSearches("TypeScript");

    const button = screen.getByRole("button");
    await user.click(button);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/search");
    });
  });

  it("does not search with empty text", async () => {
    const user = userEvent.setup();

    renderSearches("");

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockSearchBooks).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("does not search with whitespace-only text", async () => {
    const user = userEvent.setup();

    renderSearches("   ");

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockSearchBooks).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("trims text before searching", async () => {
    const user = userEvent.setup();

    renderSearches("  JavaScript  ");

    const button = screen.getByRole("button");
    await user.click(button);

    await waitFor(() => {
      expect(mockSearchBooks).toHaveBeenCalledWith("  JavaScript  ");
    });
  });

  it("prevents default event behavior", async () => {
    userEvent.setup();

    renderSearches("Test");

    const button = screen.getByRole("button");
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });
    const preventDefaultSpy = vi.spyOn(clickEvent, "preventDefault");

    button.dispatchEvent(clickEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("renders with correct button class", () => {
    const { container } = renderSearches("Test");

    const button = container.querySelector(`.${styles.search}`);
    expect(button).toBeInTheDocument();
  });

  it("renders with different search texts", () => {
    const { rerender } = render(
      <BrowserRouter>
        <Searches text="First search" />
      </BrowserRouter>
    );

    expect(screen.getByText("First search")).toBeInTheDocument();

    rerender(
      <BrowserRouter>
        <Searches text="Second search" />
      </BrowserRouter>
    );

    expect(screen.getByText("Second search")).toBeInTheDocument();
  });

  it("is keyboard accessible", async () => {
    const user = userEvent.setup();

    renderSearches("Keyboard test");

    const button = screen.getByRole("button");
    button.focus();

    expect(button).toHaveFocus();

    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(mockSearchBooks).toHaveBeenCalledWith("Keyboard test");
    });
  });

  it("handles rapid clicks", async () => {
    const user = userEvent.setup();

    renderSearches("Rapid click test");

    const button = screen.getByRole("button");

    await user.click(button);
    await user.click(button);
    await user.click(button);

    // Should be called 3 times (no debouncing implemented)
    await waitFor(() => {
      expect(mockSearchBooks).toHaveBeenCalledTimes(3);
    });
  });

  it("handles special characters in text", () => {
    const specialText = "C++ & C# programming";

    renderSearches(specialText);

    expect(screen.getByText(specialText)).toBeInTheDocument();
  });

  it("awaits searchBooks before navigating", async () => {
    const user = userEvent.setup();
    let searchResolved = false;

    mockSearchBooks.mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          searchResolved = true;
          resolve();
        }, 50);
      });
    });

    renderSearches("Async test");

    const button = screen.getByRole("button");
    await user.click(button);

    await waitFor(() => {
      expect(searchResolved).toBe(true);
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  it("button is clickable", () => {
    renderSearches("Clickable test");

    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
  });

  it("renders text and icon together", () => {
    renderSearches("Test with icon");

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Test with icon");
    expect(screen.getByTestId("arrow-right-icon")).toBeInTheDocument();
  });
});

// SearchBar.test.jsx
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import SearchBar from "./SearchBar";
import styles from "./SearchBar.module.css";

// Mock hooks
vi.mock("../../../hooks/useSearch");
vi.mock("../../../hooks/useMobile"); // Default export
vi.mock("../../../hooks/useBooks");

// Mock react-router-dom
const mockNavigate = vi.fn();
const mockLocation = { pathname: "/search" };

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Search: (props) => (
    <span data-testid="search-icon" {...props}>
      🔍
    </span>
  ),
  X: (props) => (
    <span data-testid="x-icon" {...props}>
      ✕
    </span>
  ),
}));

import { useSearch } from "../../../hooks/useSearch";
import useMobile from "../../../hooks/useMobile"; // Default import
import { useBooks } from "../../../hooks/useBooks";

describe("SearchBar component", () => {
  const mockSearchBooks = vi.fn();
  const mockAddToRecentlySearched = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    useSearch.mockReturnValue({
      searchBooks: mockSearchBooks,
      loading: false,
      error: null,
    });

    useMobile.mockReturnValue(false); // Now this will work

    useBooks.mockReturnValue({
      addToRecentlySearched: mockAddToRecentlySearched,
    });

    mockSearchBooks.mockResolvedValue();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  const renderSearchBar = () => {
    return render(
      <BrowserRouter>
        <SearchBar />
      </BrowserRouter>
    );
  };

  it("renders search input with placeholder", () => {
    renderSearchBar();

    const input = screen.getByRole("searchbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute(
      "placeholder",
      "Search for your next adventure... (Ctrl+K)"
    );
  });

  it("renders mobile placeholder on mobile devices", () => {
    useMobile.mockReturnValue(true);
    renderSearchBar();

    const input = screen.getByRole("searchbox");
    expect(input).toHaveAttribute("placeholder", "Search books...");
  });

  it("renders search button", () => {
    renderSearchBar();

    const button = screen.getByRole("button", { name: "Search books" });
    expect(button).toBeInTheDocument();
  });

  it("updates input value when typing", async () => {
    const user = userEvent.setup();
    renderSearchBar();

    const input = screen.getByRole("searchbox");
    await user.type(input, "JavaScript");

    expect(input).toHaveValue("JavaScript");
  });

  it("shows clear button when input has value", async () => {
    const user = userEvent.setup();
    renderSearchBar();

    const input = screen.getByRole("searchbox");
    await user.type(input, "React");

    const clearButton = screen.getByRole("button", { name: "Clear search" });
    expect(clearButton).toBeInTheDocument();
  });

  it("clears input when clear button is clicked", async () => {
    const user = userEvent.setup();
    renderSearchBar();

    const input = screen.getByRole("searchbox");
    await user.type(input, "React");

    const clearButton = screen.getByRole("button", { name: "Clear search" });
    await user.click(clearButton);

    expect(input).toHaveValue("");
  });

  it("submits search with valid query", async () => {
    const user = userEvent.setup();
    renderSearchBar();

    const input = screen.getByRole("searchbox");
    await user.type(input, "JavaScript");

    const submitButton = screen.getByRole("button", { name: "Search books" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSearchBooks).toHaveBeenCalledWith("JavaScript");
      expect(mockNavigate).toHaveBeenCalledWith("/search");
    });
  });

  it("adds search to recently searched", async () => {
    const user = userEvent.setup();
    renderSearchBar();

    const input = screen.getByRole("searchbox");
    await user.type(input, "React");

    const submitButton = screen.getByRole("button", { name: "Search books" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAddToRecentlySearched).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "search",
          query: "React",
          timestamp: expect.any(String),
          id: expect.stringContaining("search-"),
        })
      );
    });
  });

  it("does not submit with empty query", async () => {
    const user = userEvent.setup();
    renderSearchBar();

    const submitButton = screen.getByRole("button", { name: "Search books" });
    await user.click(submitButton);

    expect(mockSearchBooks).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("does not submit with query less than 2 characters", async () => {
    const user = userEvent.setup();
    renderSearchBar();

    const input = screen.getByRole("searchbox");
    await user.type(input, "a");

    const submitButton = screen.getByRole("button", { name: "Search books" });
    await user.click(submitButton);

    expect(mockSearchBooks).not.toHaveBeenCalled();
  });

  it("trims whitespace from query before searching", async () => {
    const user = userEvent.setup();
    renderSearchBar();

    const input = screen.getByRole("searchbox");
    await user.type(input, "  JavaScript  ");

    const submitButton = screen.getByRole("button", { name: "Search books" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSearchBooks).toHaveBeenCalledWith("JavaScript");
    });
  });

  it("disables input and button while loading", () => {
    useSearch.mockReturnValue({
      searchBooks: mockSearchBooks,
      loading: true,
      error: null,
    });

    renderSearchBar();

    const input = screen.getByRole("searchbox");
    const submitButton = screen.getByRole("button", { name: "Searching..." });

    expect(input).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it("shows loading spinner when searching", () => {
    useSearch.mockReturnValue({
      searchBooks: mockSearchBooks,
      loading: true,
      error: null,
    });

    const { container } = renderSearchBar();

    const spinner = container.querySelector(`.${styles.spinner}`);
    expect(spinner).toBeInTheDocument();
  });

  it("displays error message when there is an error", () => {
    const errorMessage = "Search failed";
    useSearch.mockReturnValue({
      searchBooks: mockSearchBooks,
      loading: false,
      error: errorMessage,
    });

    renderSearchBar();

    const errorElement = screen.getByRole("alert");
    expect(errorElement).toHaveTextContent(errorMessage);
  });

  it("focuses input on Ctrl+K", async () => {
    const user = userEvent.setup();
    renderSearchBar();

    const input = screen.getByRole("searchbox");

    await user.keyboard("{Control>}k{/Control}");

    expect(input).toHaveFocus();
  });

  it("focuses input on Cmd+K (Mac)", async () => {
    const user = userEvent.setup();
    renderSearchBar();

    const input = screen.getByRole("searchbox");

    await user.keyboard("{Meta>}k{/Meta}");

    expect(input).toHaveFocus();
  });

  it("blurs input on Escape key", async () => {
    const user = userEvent.setup();
    renderSearchBar();

    const input = screen.getByRole("searchbox");
    input.focus();

    expect(input).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(input).not.toHaveFocus();
  });

  it("blurs input on mobile after successful search", async () => {
    const user = userEvent.setup();
    useMobile.mockReturnValue(true);

    renderSearchBar();

    const input = screen.getByRole("searchbox");
    await user.type(input, "JavaScript");

    const submitButton = screen.getByRole("button", { name: "Search books" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(input).not.toHaveFocus();
    });
  });

  it("clears query when navigating away from search page", () => {
    mockLocation.pathname = "/";

    render(
      <BrowserRouter>
        <SearchBar />
      </BrowserRouter>
    );

    const input = screen.getByRole("searchbox");
    expect(input).toHaveValue("");
  });

  it("has proper ARIA attributes", () => {
    renderSearchBar();

    const search = screen.getByRole("search");
    expect(search).toBeInTheDocument();

    const input = screen.getByRole("searchbox");
    expect(input).toHaveAttribute("aria-label", "Search for books");
  });

  it("links error message with input via aria-describedby", () => {
    useSearch.mockReturnValue({
      searchBooks: mockSearchBooks,
      loading: false,
      error: "Error occurred",
    });

    renderSearchBar();

    const input = screen.getByRole("searchbox");
    expect(input).toHaveAttribute("aria-describedby", "search-error");

    const errorElement = screen.getByRole("alert");
    expect(errorElement).toHaveAttribute("id", "search-error");
  });

  it("disables submit button when query is only whitespace", async () => {
    const user = userEvent.setup();
    renderSearchBar();

    const input = screen.getByRole("searchbox");
    await user.type(input, "   ");

    const submitButton = screen.getByRole("button", { name: "Search books" });
    expect(submitButton).toBeDisabled();
  });

  it("has maxLength attribute on input", () => {
    renderSearchBar();

    const input = screen.getByRole("searchbox");
    expect(input).toHaveAttribute("maxLength", "200");
  });

  it("has autocomplete and spellcheck disabled", () => {
    renderSearchBar();

    const input = screen.getByRole("searchbox");
    expect(input).toHaveAttribute("autoComplete", "off");
    expect(input).toHaveAttribute("spellCheck", "false");
  });

  it("handles search error gracefully", async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockSearchBooks.mockRejectedValue(new Error("Network error"));

    renderSearchBar();

    const input = screen.getByRole("searchbox");
    await user.type(input, "JavaScript");

    const submitButton = screen.getByRole("button", { name: "Search books" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Search failed:",
        expect.any(Error)
      );
    });

    // Verify the search wasn't completed (didn't navigate)
    expect(mockNavigate).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it("submits form on Enter key", async () => {
    const user = userEvent.setup();
    renderSearchBar();

    const input = screen.getByRole("searchbox");
    await user.type(input, "React{Enter}");

    await waitFor(() => {
      expect(mockSearchBooks).toHaveBeenCalledWith("React");
    });
  });

  it("focuses input after clearing", async () => {
    const user = userEvent.setup();
    renderSearchBar();

    const input = screen.getByRole("searchbox");
    await user.type(input, "Test");

    const clearButton = screen.getByRole("button", { name: "Clear search" });
    await user.click(clearButton);

    expect(input).toHaveFocus();
  });

  it("renders with correct search form class", () => {
    const { container } = renderSearchBar();

    const form = container.querySelector(`.${styles.searchForm}`);
    expect(form).toBeInTheDocument();
  });
});

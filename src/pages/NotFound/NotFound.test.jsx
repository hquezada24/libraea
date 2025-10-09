// NotFound.test.jsx
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import NotFound from "./NotFound";
import styles from "./NotFound.module.css";

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock Button component
vi.mock("../../components/common/Button/Button", () => ({
  default: ({ text, link, children, className, ...props }) => (
    <a href={link} className={className} {...props}>
      {children || text}
    </a>
  ),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  ArrowLeft: () => <span data-testid="arrow-left-icon">←</span>,
  Home: () => <span data-testid="home-icon">🏠</span>,
  Search: () => <span data-testid="search-icon">🔍</span>,
  BookOpen: () => <span data-testid="book-open-icon">📖</span>,
}));

describe("NotFound component", () => {
  const originalTitle = document.title;

  beforeEach(() => {
    vi.clearAllMocks();
    document.title = originalTitle;
  });

  afterEach(() => {
    document.title = originalTitle;
  });

  const renderNotFound = () => {
    return render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );
  };

  it("renders 404 error message", () => {
    renderNotFound();

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
    expect(
      screen.getByText("Let's help you find your way back to the books!")
    ).toBeInTheDocument();
  });

  it("sets document title on mount", () => {
    renderNotFound();
    expect(document.title).toBe("Page Not Found - Libraea");
  });

  it("resets document title on unmount", () => {
    const { unmount } = renderNotFound();
    expect(document.title).toBe("Page Not Found - Libraea");

    unmount();
    expect(document.title).toBe("Libraea - Track Your Reading Universe");
  });

  it("renders all navigation buttons", () => {
    renderNotFound();

    expect(screen.getByText("Back Home")).toBeInTheDocument();
    expect(screen.getByText("Go Back")).toBeInTheDocument();
    expect(screen.getByText("Search Books")).toBeInTheDocument();
    expect(screen.getByText("My Library")).toBeInTheDocument();
  });

  it("renders all icons", () => {
    renderNotFound();

    expect(screen.getByTestId("home-icon")).toBeInTheDocument();
    expect(screen.getByTestId("arrow-left-icon")).toBeInTheDocument();
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
    expect(screen.getByTestId("book-open-icon")).toBeInTheDocument();
  });

  it("displays keyboard shortcuts help section", () => {
    renderNotFound();

    expect(screen.getByText("Quick Navigation")).toBeInTheDocument();
    expect(screen.getByText("H")).toBeInTheDocument();
    expect(screen.getByText("S")).toBeInTheDocument();
    expect(screen.getByText("Esc")).toBeInTheDocument();
  });

  it("navigates back when go back button is clicked with history", async () => {
    const user = userEvent.setup();
    // Mock history.length to be > 1
    Object.defineProperty(window.history, "length", {
      value: 2,
      writable: true,
      configurable: true,
    });

    renderNotFound();

    const goBackButton = screen.getByRole("button", {
      name: /go back to previous page/i,
    });
    await user.click(goBackButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("navigates to home when go back button is clicked without history", async () => {
    const user = userEvent.setup();
    // Mock window.history.length to be 1 (no history)
    Object.defineProperty(window.history, "length", {
      value: 1,
      writable: true,
      configurable: true,
    });

    renderNotFound();

    const goBackButton = screen.getByRole("button", {
      name: /go back to previous page/i,
    });
    await user.click(goBackButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("navigates to home when H key is pressed", async () => {
    const user = userEvent.setup();
    renderNotFound();

    await user.keyboard("h");

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("navigates to home when Shift+H is pressed", async () => {
    const user = userEvent.setup();
    renderNotFound();

    await user.keyboard("H");

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("navigates to search when S key is pressed", async () => {
    const user = userEvent.setup();
    renderNotFound();

    await user.keyboard("s");

    expect(mockNavigate).toHaveBeenCalledWith("/search");
  });

  it("navigates to search when Shift+S is pressed", async () => {
    const user = userEvent.setup();
    renderNotFound();

    await user.keyboard("S");

    expect(mockNavigate).toHaveBeenCalledWith("/search");
  });

  it("goes back when Escape key is pressed with history", async () => {
    const user = userEvent.setup();
    // Mock history.length to be > 1
    Object.defineProperty(window.history, "length", {
      value: 2,
      writable: true,
      configurable: true,
    });

    renderNotFound();

    await user.keyboard("{Escape}");

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("navigates to home when Escape key is pressed without history", async () => {
    const user = userEvent.setup();
    // Mock window.history.length to be 1 (no history)
    Object.defineProperty(window.history, "length", {
      value: 1,
      writable: true,
      configurable: true,
    });

    renderNotFound();

    await user.keyboard("{Escape}");

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("has proper ARIA attributes", () => {
    renderNotFound();

    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();

    const errorCode = screen.getByLabelText("Error code");
    expect(errorCode).toHaveTextContent("404");
  });

  it("renders with correct container class", () => {
    const { container } = renderNotFound();
    // The structure is: BrowserRouter > div.notFound
    const notFoundDiv = container.querySelector(`.${styles.notFound}`);
    expect(notFoundDiv).toBeInTheDocument();
    expect(notFoundDiv).toHaveClass(styles.notFound);
  });

  it("has correct link destinations for navigation buttons", () => {
    renderNotFound();

    const homeLink = screen.getByLabelText("Go back to home page");
    expect(homeLink).toHaveAttribute("href", "/");

    const searchLink = screen.getByLabelText("Go to book search");
    expect(searchLink).toHaveAttribute("href", "/search");

    const libraryLink = screen.getByLabelText("Go to my library");
    expect(libraryLink).toHaveAttribute("href", "/my-library");
  });

  it("cleans up event listeners on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");
    const { unmount } = renderNotFound();

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );

    removeEventListenerSpy.mockRestore();
  });
});

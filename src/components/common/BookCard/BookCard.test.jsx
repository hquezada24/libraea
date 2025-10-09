// BookCard.test.jsx
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookCard from "./BookCard";
import styles from "./BookCard.module.css";

// Mock hooks
vi.mock("../../../hooks/useSearch");
vi.mock("../../../hooks/useBooks");

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Star: ({ fill, stroke, ...props }) => (
    <span
      data-testid="star-icon"
      data-fill={fill}
      data-stroke={stroke}
      {...props}
    >
      ★
    </span>
  ),
  Bookmark: ({ fill, stroke, ...props }) => (
    <span
      data-testid="bookmark-icon"
      data-fill={fill}
      data-stroke={stroke}
      {...props}
    >
      🔖
    </span>
  ),
}));

import { useSearch } from "../../../hooks/useSearch";
import { useBooks } from "../../../hooks/useBooks";

describe("BookCard component", () => {
  const mockFetchBookCover = vi.fn();
  const mockAddToFavorites = vi.fn();
  const mockRemoveFromFavorites = vi.fn();
  const mockAddToWantToRead = vi.fn();
  const mockRemoveFromWantToRead = vi.fn();
  const mockIsFavorite = vi.fn();
  const mockIsInWantToRead = vi.fn();

  const mockBook = {
    key: "/works/OL123W",
    title: "JavaScript: The Good Parts",
    author_name: ["Douglas Crockford"],
    first_publish_year: 2008,
    cover_edition_key: "OL123M",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    useSearch.mockReturnValue({
      fetchBookCover: mockFetchBookCover,
    });

    useBooks.mockReturnValue({
      addToFavorites: mockAddToFavorites,
      removeFromFavorites: mockRemoveFromFavorites,
      addToWantToRead: mockAddToWantToRead,
      removeFromWantToRead: mockRemoveFromWantToRead,
      isFavorite: mockIsFavorite,
      isInWantToRead: mockIsInWantToRead,
    });

    mockIsFavorite.mockReturnValue(false);
    mockIsInWantToRead.mockReturnValue(false);
    mockFetchBookCover.mockResolvedValue("https://example.com/cover.jpg");
  });

  it("renders book information correctly", async () => {
    render(<BookCard book={mockBook} />);

    expect(screen.getByText("JavaScript: The Good Parts")).toBeInTheDocument();
    expect(screen.getByText("Douglas Crockford")).toBeInTheDocument();
    expect(screen.getByText("2008")).toBeInTheDocument();
  });

  it("renders with default values when book data is missing", () => {
    const incompleteBook = {
      key: "/works/OL456W",
    };

    render(<BookCard book={incompleteBook} />);

    expect(screen.getByText("Unknown Title")).toBeInTheDocument();
    expect(screen.getByText("Unknown Author")).toBeInTheDocument();
    expect(screen.getByText("Unknown Year")).toBeInTheDocument();
  });

  it("handles multiple authors correctly", () => {
    const bookWithMultipleAuthors = {
      ...mockBook,
      author_name: ["Author One", "Author Two", "Author Three"],
    };

    render(<BookCard book={bookWithMultipleAuthors} />);

    expect(screen.getByText("Author One")).toBeInTheDocument();
    expect(screen.getByText("Author Two")).toBeInTheDocument();
    expect(screen.getByText("Author Three")).toBeInTheDocument();
  });

  it("displays loading state while fetching cover", () => {
    mockFetchBookCover.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve("url"), 100))
    );

    render(<BookCard book={mockBook} />);

    expect(screen.getByLabelText("Loading book cover")).toBeInTheDocument();
  });

  it("displays book cover when successfully loaded", async () => {
    render(<BookCard book={mockBook} />);

    await waitFor(() => {
      const coverImage = screen.getByAltText(
        "Cover for JavaScript: The Good Parts"
      );
      expect(coverImage).toBeInTheDocument();
      expect(coverImage).toHaveAttribute(
        "src",
        "https://example.com/cover.jpg"
      );
    });
  });

  it("displays no cover fallback when cover fetch fails", async () => {
    mockFetchBookCover.mockResolvedValue(null);

    render(<BookCard book={mockBook} />);

    await waitFor(() => {
      expect(screen.getByLabelText("No cover available")).toBeInTheDocument();
      expect(screen.getByText("No Cover")).toBeInTheDocument();
    });
  });

  it("displays no cover fallback when cover ID is missing", async () => {
    const bookWithoutCover = {
      ...mockBook,
      cover_edition_key: null,
      cover_i: null,
    };

    render(<BookCard book={bookWithoutCover} />);

    await waitFor(() => {
      expect(screen.getByLabelText("No cover available")).toBeInTheDocument();
    });
  });

  it("handles image loading error", async () => {
    render(<BookCard book={mockBook} />);

    await waitFor(() => {
      const coverImage = screen.getByAltText(
        "Cover for JavaScript: The Good Parts"
      );
      expect(coverImage).toBeInTheDocument();
    });

    const coverImage = screen.getByAltText(
      "Cover for JavaScript: The Good Parts"
    );

    // Simulate image error
    coverImage.dispatchEvent(new Event("error"));

    await waitFor(() => {
      expect(screen.getByLabelText("No cover available")).toBeInTheDocument();
    });
  });

  it("adds book to favorites when star button is clicked", async () => {
    const user = userEvent.setup();
    render(<BookCard book={mockBook} />);

    const favoriteButton = screen.getByLabelText(
      `Add "JavaScript: The Good Parts" to favorites`
    );
    await user.click(favoriteButton);

    expect(mockAddToFavorites).toHaveBeenCalledWith(mockBook);
    expect(mockAddToFavorites).toHaveBeenCalledTimes(1);
  });

  it("removes book from favorites when star button is clicked and book is already favorited", async () => {
    const user = userEvent.setup();
    mockIsFavorite.mockReturnValue(true);

    render(<BookCard book={mockBook} />);

    const favoriteButton = screen.getByLabelText(
      `Remove "JavaScript: The Good Parts" from favorites`
    );
    await user.click(favoriteButton);

    expect(mockRemoveFromFavorites).toHaveBeenCalledWith(mockBook.key);
    expect(mockRemoveFromFavorites).toHaveBeenCalledTimes(1);
  });

  it("adds book to want to read when bookmark button is clicked", async () => {
    const user = userEvent.setup();
    render(<BookCard book={mockBook} />);

    const saveButton = screen.getByLabelText(
      `Add "JavaScript: The Good Parts" to want to read list`
    );
    await user.click(saveButton);

    expect(mockAddToWantToRead).toHaveBeenCalledWith(mockBook);
    expect(mockAddToWantToRead).toHaveBeenCalledTimes(1);
  });

  it("removes book from want to read when bookmark button is clicked and book is already saved", async () => {
    const user = userEvent.setup();
    mockIsInWantToRead.mockReturnValue(true);

    render(<BookCard book={mockBook} />);

    const saveButton = screen.getByLabelText(
      `Remove "JavaScript: The Good Parts" from want to read list`
    );
    await user.click(saveButton);

    expect(mockRemoveFromWantToRead).toHaveBeenCalledWith(mockBook.key);
    expect(mockRemoveFromWantToRead).toHaveBeenCalledTimes(1);
  });

  it("displays active state for favorite button when book is favorited", () => {
    mockIsFavorite.mockReturnValue(true);

    render(<BookCard book={mockBook} />);

    const favoriteButton = screen.getByLabelText(
      `Remove "JavaScript: The Good Parts" from favorites`
    );
    expect(favoriteButton).toHaveAttribute("aria-pressed", "true");

    const starIcon = screen.getByTestId("star-icon");
    expect(starIcon).toHaveAttribute("data-fill", "gold");
    expect(starIcon).toHaveAttribute("data-stroke", "gold");
  });

  it("displays active state for save button when book is in want to read", () => {
    mockIsInWantToRead.mockReturnValue(true);

    render(<BookCard book={mockBook} />);

    const saveButton = screen.getByLabelText(
      `Remove "JavaScript: The Good Parts" from want to read list`
    );
    expect(saveButton).toHaveAttribute("aria-pressed", "true");

    const bookmarkIcon = screen.getByTestId("bookmark-icon");
    expect(bookmarkIcon).toHaveAttribute("data-fill", "#6495ED");
    expect(bookmarkIcon).toHaveAttribute("data-stroke", "#6495ED");
  });

  it("has proper ARIA attributes", () => {
    render(<BookCard book={mockBook} />);

    const article = screen.getByRole("gridcell");
    expect(article).toHaveAttribute(
      "aria-label",
      "JavaScript: The Good Parts by Douglas Crockford"
    );

    const actionsGroup = screen.getByRole("group", { name: /book actions/i });
    expect(actionsGroup).toBeInTheDocument();
  });

  it("prevents event propagation when clicking action buttons", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <div onClick={handleClick}>
        <BookCard book={mockBook} />
      </div>
    );

    const favoriteButton = screen.getByLabelText(
      `Add "JavaScript: The Good Parts" to favorites`
    );
    await user.click(favoriteButton);

    // Parent click handler should not be called
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("handles errors when adding to favorites fails", async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockAddToFavorites.mockImplementation(() => {
      throw new Error("Failed to add");
    });

    render(<BookCard book={mockBook} />);

    const favoriteButton = screen.getByLabelText(
      `Add "JavaScript: The Good Parts" to favorites`
    );
    await user.click(favoriteButton);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to toggle favorite:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it("handles errors when adding to want to read fails", async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockAddToWantToRead.mockImplementation(() => {
      throw new Error("Failed to add");
    });

    render(<BookCard book={mockBook} />);

    const saveButton = screen.getByLabelText(
      `Add "JavaScript: The Good Parts" to want to read list`
    );
    await user.click(saveButton);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to toggle want to read:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it("uses cover_i when cover_edition_key is not available", async () => {
    const bookWithCoverId = {
      ...mockBook,
      cover_edition_key: null,
      cover_i: 12345,
    };

    render(<BookCard book={bookWithCoverId} />);

    await waitFor(() => {
      expect(mockFetchBookCover).toHaveBeenCalledWith(12345, "M");
    });
  });

  it("renders with correct container class", () => {
    const { container } = render(<BookCard book={mockBook} />);
    const bookCardArticle = container.querySelector(`.${styles.bookCard}`);
    expect(bookCardArticle).toBeInTheDocument();
  });

  it("sets lazy loading attribute on cover image", async () => {
    render(<BookCard book={mockBook} />);

    await waitFor(() => {
      const coverImage = screen.getByAltText(
        "Cover for JavaScript: The Good Parts"
      );
      expect(coverImage).toHaveAttribute("loading", "lazy");
    });
  });

  it("handles single author as string instead of array", () => {
    const bookWithStringAuthor = {
      ...mockBook,
      author_name: "Single Author",
    };

    render(<BookCard book={bookWithStringAuthor} />);

    expect(screen.getByText("Single Author")).toBeInTheDocument();
  });
});

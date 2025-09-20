import styles from "./BookCard.module.css";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearch } from "../../../hooks/useSearch";
import { useBooks } from "../../../hooks/useBooks";
import { Star, Bookmark } from "lucide-react";

const BookCard = ({ book }) => {
  const { fetchBookCover } = useSearch();
  const {
    addToFavorites,
    removeFromFavorites,
    addToWantToRead,
    removeFromWantToRead,
    isFavorite,
    isInWantToRead,
  } = useBooks();

  const [coverUrl, setCoverUrl] = useState(null);
  const [isLoadingCover, setIsLoadingCover] = useState(false);
  const [coverError, setCoverError] = useState(false);

  // Memoize derived states to prevent unnecessary re-renders
  const isLiked = useMemo(() => isFavorite(book.key), [isFavorite, book.key]);
  const isSaved = useMemo(
    () => isInWantToRead(book.key),
    [isInWantToRead, book.key]
  );

  // Memoize formatted data
  const bookData = useMemo(
    () => ({
      title: book.title || "Unknown Title",
      authors:
        book.author_name && Array.isArray(book.author_name)
          ? book.author_name
          : book.author_name
          ? [book.author_name]
          : ["Unknown Author"],
      year: book.first_publish_year || "Unknown Year",
      coverId: book.cover_edition_key || book.cover_i,
    }),
    [book]
  );

  // Cover fetching with cleanup
  useEffect(() => {
    let isMounted = true;

    const getCover = async () => {
      if (!bookData.coverId) {
        if (isMounted) {
          setCoverUrl(null);
          setCoverError(true);
        }
        return;
      }

      setIsLoadingCover(true);
      setCoverError(false);

      try {
        const url = await fetchBookCover(bookData.coverId, "M");
        if (isMounted) {
          if (url) {
            setCoverUrl(url);
          } else {
            setCoverError(true);
          }
        }
      } catch (error) {
        console.warn(`Failed to fetch cover for ${book.key}:`, error);
        if (isMounted) {
          setCoverError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoadingCover(false);
        }
      }
    };

    getCover();

    return () => {
      isMounted = false;
    };
  }, [fetchBookCover, bookData.coverId, book.key]);

  // Event handlers with error handling
  const handleLike = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      try {
        if (isLiked) {
          removeFromFavorites(book.key);
        } else {
          addToFavorites(book);
        }
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
      }
    },
    [isLiked, book, addToFavorites, removeFromFavorites]
  );

  const handleSave = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      try {
        if (isSaved) {
          removeFromWantToRead(book.key);
        } else {
          addToWantToRead(book);
        }
      } catch (error) {
        console.error("Failed to toggle want to read:", error);
      }
    },
    [isSaved, book, addToWantToRead, removeFromWantToRead]
  );

  const handleImageError = useCallback(() => {
    setCoverError(true);
    setCoverUrl(null);
  }, []);

  return (
    <article
      className={styles.bookCard}
      role="gridcell"
      aria-label={`${bookData.title} by ${bookData.authors.join(", ")}`}
    >
      <div className={styles.bookCover} aria-hidden="true">
        {isLoadingCover ? (
          <div className={styles.loadingCover} aria-label="Loading book cover">
            <div className={styles.spinner}></div>
          </div>
        ) : coverUrl && !coverError ? (
          <img
            src={coverUrl}
            alt={`Cover for ${bookData.title}`}
            onError={handleImageError}
            className={styles.coverImage}
            loading="lazy"
          />
        ) : (
          <div className={styles.noCover} aria-label="No cover available">
            <div className={styles.noCoverIcon}>📚</div>
            <span className={styles.noCoverText}>No Cover</span>
          </div>
        )}
      </div>

      <div className={styles.info}>
        <h3 className={styles.title} title={bookData.title}>
          {bookData.title}
        </h3>

        <div className={styles.authors}>
          {bookData.authors.map((author, index) => (
            <span
              key={`${book.key}-author-${index}`}
              className={styles.author}
              title={author}
            >
              {author}
            </span>
          ))}
        </div>

        <div className={styles.year} title={`Published: ${bookData.year}`}>
          {bookData.year}
        </div>
      </div>

      <div className={styles.actions} role="group" aria-label="Book actions">
        <button
          className={`${styles.actionButton} ${styles.favorite} ${
            isLiked ? styles.favoriteActive : ""
          }`}
          onClick={handleLike}
          aria-label={
            isLiked
              ? `Remove "${bookData.title}" from favorites`
              : `Add "${bookData.title}" to favorites`
          }
          aria-pressed={isLiked}
          type="button"
        >
          <Star
            className={styles.favoriteIcon}
            fill={isLiked ? "gold" : "transparent"}
            stroke={isLiked ? "gold" : "currentColor"}
            aria-hidden="true"
          />
        </button>

        <button
          className={`${styles.actionButton} ${styles.save} ${
            isSaved ? styles.saveActive : ""
          }`}
          onClick={handleSave}
          aria-label={
            isSaved
              ? `Remove "${bookData.title}" from want to read list`
              : `Add "${bookData.title}" to want to read list`
          }
          aria-pressed={isSaved}
          type="button"
        >
          <Bookmark
            className={styles.saveIcon}
            fill={isSaved ? "#6495ED" : "transparent"}
            stroke={isSaved ? "#6495ED" : "currentColor"}
            aria-hidden="true"
          />
        </button>
      </div>
    </article>
  );
};

export default BookCard;

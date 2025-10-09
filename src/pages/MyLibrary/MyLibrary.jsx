import styles from "./MyLibrary.module.css";
import { useState } from "react";
import { useBooks } from "../../hooks/useBooks";
import BookCard from "../../components/common/BookCard/BookCard";

const LIBRARY_SECTIONS = {
  FAVORITES: "favorites",
  WANT_TO_READ: "wantToRead",
};

const MyLibrary = () => {
  const { favorites, wantToRead, isLoaded, error } = useBooks();
  const [activeOption, setActiveOption] = useState(LIBRARY_SECTIONS.FAVORITES);

  // Show loading state
  if (!isLoaded) {
    return (
      <div className={styles.library} aria-live="polite">
        <div className={styles.loadingState}>
          <h2 className={styles.headline}>My Library</h2>
          <p>Loading your books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.library} aria-live="assertive">
        <div className={styles.errorState}>
          <h2 className={styles.headline}>My Library</h2>
          <p className={styles.errorMessage}>
            Unable to load your library: {error}
          </p>
        </div>
      </div>
    );
  }

  const handleTabChange = (section) => {
    setActiveOption(section);
  };

  const handleKeyDown = (e, section) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleTabChange(section);
    }
  };

  return (
    <main className={styles.library}>
      <h2 className={styles.headline}>My Library</h2>

      <div
        className={styles.tabContainer}
        role="tablist"
        aria-label="Library sections"
      >
        <button
          className={`${styles.tab} ${styles.favBtn} ${
            activeOption === LIBRARY_SECTIONS.FAVORITES
              ? styles.fOn
              : styles.fOff
          }`}
          onClick={() => handleTabChange(LIBRARY_SECTIONS.FAVORITES)}
          role="tab"
          aria-selected={activeOption === LIBRARY_SECTIONS.FAVORITES}
          aria-controls="favorites-panel"
          id="favorites-tab"
          onKeyDown={handleKeyDown}
        >
          Favorites
        </button>
        <button
          className={`${styles.tab} ${styles.wtrBtn} ${
            activeOption === LIBRARY_SECTIONS.WANT_TO_READ
              ? styles.wtrOn
              : styles.wtrOff
          }`}
          onClick={() => handleTabChange(LIBRARY_SECTIONS.WANT_TO_READ)}
          role="tab"
          aria-selected={activeOption === LIBRARY_SECTIONS.WANT_TO_READ}
          aria-controls="want-to-read-panel"
          id="want-to-read-tab"
          onKeyDown={handleKeyDown}
        >
          Want to read
        </button>
      </div>

      <div className={styles.lists}>
        <section
          className={`${styles.section} ${
            activeOption === LIBRARY_SECTIONS.FAVORITES
              ? styles.active
              : styles.hidden
          }`}
          role="tabpanel"
          aria-labelledby="favorites-tab"
          id="favorites-panel"
        >
          <h3 className={styles.subheadline}>Favorites</h3>
          <div>
            {favorites.length > 0 ? (
              <div
                className={styles.grid}
                role="grid"
                aria-label="Favorite books"
              >
                {favorites.map((book) => (
                  <BookCard key={`favorite-${book.key}`} book={book} />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p className={styles.emptyMessage}>No favorite books yet</p>
                <p className={styles.emptySubtext}>
                  Search for books and click the star icon to add them to your
                  favorites!
                </p>
              </div>
            )}
          </div>
        </section>
        <section
          className={`${styles.section} ${
            activeOption === LIBRARY_SECTIONS.WANT_TO_READ
              ? styles.active
              : styles.hidden
          }`}
          role="tabpanel"
          aria-labelledby="want-to-read-tab"
          id="want-to-read-panel"
        >
          <h3 className={styles.subheadline}>Want to Read</h3>
          <div>
            {wantToRead.length > 0 ? (
              <div
                className={styles.grid}
                role="grid"
                aria-label="Want to read books"
              >
                {wantToRead.map((book) => (
                  <BookCard key={`want-to-read-${book.key}`} book={book} />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p className={styles.emptyMessage}>
                  No books in your reading list yet
                </p>
                <p className={styles.emptySubtext}>
                  Search for books and click the bookmark icon to add them to
                  your reading list!
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default MyLibrary;

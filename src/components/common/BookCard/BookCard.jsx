import styles from "./BookCard.module.css";
import { useState, useEffect } from "react";
import { useSearch } from "../../../hooks/useSearch";
import { useBooks } from "../../../hooks/useBooks";
import { Star, Bookmark } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

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

  // Derive states directly from context
  const isLiked = isFavorite(book.key);
  const isSaved = isInWantToRead(book.key);

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates on an unmounted component

    const getCover = async () => {
      if (!book.cover_edition_key) {
        // If there's no OLID, there's no point trying to fetch
        if (isMounted) setCoverUrl(null);
        return;
      }
      setIsLoadingCover(true);
      const url = await fetchBookCover(book.cover_edition_key);
      // Only update state if the component is still mounted
      if (isMounted) {
        setCoverUrl(url);
        setIsLoadingCover(false);
      }
    };

    getCover();

    // Cleanup function: runs if the component unmounts before the fetch finishes
    return () => {
      isMounted = false;
    };
  }, [fetchBookCover, book.cover_edition_key]); // Re-run if the olid changes

  const handleLike = () => {
    if (isLiked) {
      removeFromFavorites(book.key);
    } else {
      addToFavorites(book);
    }
  };
  const handleSave = () => {
    if (isSaved) {
      removeFromWantToRead(book.key);
    } else {
      addToWantToRead(book);
    }
  };

  return (
    <div className={styles.bookCard}>
      <div className={styles.bookCover}>
        {isLoadingCover ? (
          <p>Loading cover...</p>
        ) : coverUrl ? (
          <img src={coverUrl} alt={`Cover for ${book.title}`} />
        ) : (
          <div className={styles.noCover}>No Cover</div>
        )}
      </div>
      <div className={styles.info}>
        <div className={styles.title}>{book.title}</div>
        {book.author_name ? (
          book.author_name.map((author) => {
            return (
              <div key={uuidv4()} className={styles.author}>
                {author}
              </div>
            );
          })
        ) : (
          <div key={uuidv4()} className={styles.author}>
            No Author
          </div>
        )}
        {/* <div className="author">{author}</div> */}
        <div className="year">{book.first_publish_year}</div>
      </div>
      <div className="buttons">
        <button
          className={styles.favorite}
          onClick={handleLike}
          title={isLiked ? "Remove from favorites" : "Add to favorites"}
        >
          <Star
            className={styles.favoriteIcon}
            fill={isLiked ? "gold" : "transparent"}
          />
        </button>
        <button
          className={styles.save}
          onClick={handleSave}
          title={isSaved ? "Remove from want to read" : "Add to want to read"}
        >
          <Bookmark
            className={styles.saveIcon}
            fill={isSaved ? "#6495ED" : "transparent"}
          />
        </button>
      </div>
    </div>
  );
};

export default BookCard;

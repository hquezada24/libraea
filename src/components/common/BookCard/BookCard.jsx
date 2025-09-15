import styles from "./BookCard.module.css";
import { useState, useEffect } from "react";
import { useSearch } from "../../../hooks/useSearch";

const BookCard = ({ title, author, year, olid }) => {
  const { fetchBookCover } = useSearch();
  const [coverUrl, setCoverUrl] = useState(null);
  const [isLoadingCover, setIsLoadingCover] = useState(false);

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates on an unmounted component

    const getCover = async () => {
      if (!olid) {
        // If there's no OLID, there's no point trying to fetch
        if (isMounted) setCoverUrl(null);
        return;
      }
      setIsLoadingCover(true);
      const url = await fetchBookCover(olid);
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
  }, [fetchBookCover, olid]); // Re-run if the olid changes

  return (
    <div className={styles.bookCard}>
      <div className={styles.bookCover}>
        {isLoadingCover ? (
          <p>Loading cover...</p>
        ) : coverUrl ? (
          <img src={coverUrl} alt={`Cover for ${title}`} />
        ) : (
          <div>No Cover</div>
        )}
      </div>
      <div className={styles.info}>
        <div className={styles.title}>{title}</div>
        {author ? (
          author.map((author) => {
            return (
              <div
                key={`${olid}${year}` || `${author}${year}`}
                className={styles.author}
              >
                {author}
              </div>
            );
          })
        ) : (
          <div key={`${title}-no-author`} className={styles.author}>
            No Author
          </div>
        )}
        {/* <div className="author">{author}</div> */}
        <div className="year">{year}</div>
      </div>
    </div>
  );
};

export default BookCard;

import styles from "./MyLibrary.module.css";
import { useState } from "react";
import { useBooks } from "../../hooks/useBooks";
import BookCard from "../../components/common/BookCard/BookCard";
import { v4 as uuid } from "uuid";

const MyLibrary = () => {
  const { favorites, wantToRead } = useBooks();
  const [activeOption, setActiveOption] = useState("favorites");

  return (
    <div className={styles.library}>
      <h2 className={styles.headline}>My Library</h2>

      <div className="options">
        <button
          onClick={() => {
            setActiveOption("favorites");
          }}
        >
          Favorites
        </button>
        <button
          onClick={() => {
            setActiveOption("wantToRead");
          }}
        >
          Want to read
        </button>
      </div>

      <div className={styles.lists}>
        <section
          className={`${styles.favorites} ${
            activeOption === "favorites" ? "" : styles.hide
          }`}
        >
          <h3 className={styles.subheadline}>Favorites</h3>
          <div className={favorites.length > 0 ? styles.grid : ""}>
            {favorites.length > 0 ? (
              favorites.map((book) => {
                return <BookCard key={uuid()} book={book} />;
              })
            ) : (
              <p> No favorite books</p>
            )}
          </div>
        </section>
        <section
          className={`${styles.wantToRead} ${
            activeOption === "favorites" ? styles.hide : ""
          }`}
        >
          <h3 className={styles.subheadline}>Want to Read</h3>
          <div className={wantToRead.length > 0 ? styles.grid : ""}>
            {wantToRead.length > 0 ? (
              wantToRead.map((book) => {
                return <BookCard key={uuid()} book={book} />;
              })
            ) : (
              <p> No books.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyLibrary;

import styles from "./Dashboard.module.css";
import { useBooks } from "../../hooks/useBooks";
import BookCard from "../common/BookCard/BookCard";
import { v4 as uuid } from "uuid";
import Button from "../common/Button/Button";
import Searches from "../common/Searches/Searches";

const Dashboard = () => {
  const { favorites, wantToRead, recentlySearched } = useBooks();

  const favoriteSample = favorites.slice(0, 5);
  const wantToReadSample = wantToRead.slice(0, 5);
  const recentlySearchedSample = recentlySearched.slice(0, 5);

  console.log(favoriteSample);

  const hasFavorites = favorites.length > 0;
  const hasWantToRead = wantToRead.length > 0;
  const hasRecentlySearched = recentlySearched.length > 0;

  console.log(hasFavorites);

  return (
    <section className={styles.dashboard}>
      <div className={styles.favorites}>
        <h2>Your Favorites</h2>
        <div className={hasFavorites ? styles.grid : styles.flex}>
          {hasFavorites ? (
            favoriteSample.map((book) => {
              return (
                <>
                  <BookCard key={uuid()} book={book} />
                </>
              );
            })
          ) : (
            <p>Need Inspiration? </p>
          )}
          {hasFavorites && (
            <div className={styles.btn}>
              <Button text={"View All"} link="/my-library" />
            </div>
          )}
        </div>
      </div>
      <div className={styles.wantToRead}>
        <h2>Up next</h2>
        <div className={hasWantToRead ? styles.grid : styles.flex}>
          {hasWantToRead ? (
            wantToReadSample.map((book) => {
              return <BookCard key={uuid()} book={book} />;
            })
          ) : (
            <p>No saved books.</p>
          )}
          {hasWantToRead && (
            <div className={styles.btn}>
              <Button text={"View All"} link="/my-library" />
            </div>
          )}
        </div>
      </div>
      <div className={styles.recentlySearched}>
        <h2>Recently searched</h2>
        <div className={`${styles.flex} ${styles.searches}`}>
          {hasRecentlySearched ? (
            recentlySearchedSample.map((query) => {
              return <Searches key={uuid()} text={query.query} />;
            })
          ) : (
            <p>Search. Use the bar at the top. </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;

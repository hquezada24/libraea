import styles from "./BookCard.module.css";

const BookCard = ({ title, author, year }) => {
  return (
    <div className={styles.bookCard}>
      <div className={styles.bookCover}></div>
      <div className={styles.info}>
        <div className={styles.title}>{title}</div>
        {author.map((author) => {
          return (
            <div key={author} className={styles.author}>
              {author}
            </div>
          );
        })}
        {/* <div className="author">{author}</div> */}
        <div className="year">{year}</div>
      </div>
    </div>
  );
};

export default BookCard;

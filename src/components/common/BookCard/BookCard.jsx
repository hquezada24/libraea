import styles from "./BookCard.module.css";

const BookCard = ({ title, author, year }) => {
  return (
    <div className={styles.bookCard}>
      <div className="bookCover"></div>
      <div className="title">{title}</div>
      {author.map((author) => {
        return (
          <div key={author} className="author">
            {author}
          </div>
        );
      })}
      {/* <div className="author">{author}</div> */}
      <div className="year">{year}</div>
    </div>
  );
};

export default BookCard;

import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <h1>Libraea</h1>
      </div>
      <div className={styles.search}>
        <form action="">
          <input type="text" placeholder="Search for your next adventure..." />
          <button>O</button>
        </form>
      </div>
    </header>
  );
};

export default Header;

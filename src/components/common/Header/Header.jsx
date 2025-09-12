import styles from "./Header.module.css";
import SearchBar from "../SearchBar/SearchBar";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <h1>Libraea</h1>
      </div>
      <SearchBar />
      <div className={styles.icons}>
        <img src="../../../src/assets/kitten.png" alt="" />
      </div>
    </header>
  );
};

export default Header;

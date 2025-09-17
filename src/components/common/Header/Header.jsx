import styles from "./Header.module.css";
import SearchBar from "../SearchBar/SearchBar";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="../../../src/assets/griffin.png" alt="" />
        <h1>Libraea</h1>
      </div>
      <SearchBar />
      <div className={styles.link}>
        <Link to="/my-library">My Library</Link>
      </div>
    </header>
  );
};

export default Header;

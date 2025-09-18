import styles from "./Header.module.css";
import SearchBar from "../SearchBar/SearchBar";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="../../../src/assets/griffin.png" alt="" />
        <Link to={"/"}>
          <h1>Libraea</h1>
        </Link>
      </div>
      <SearchBar />
      <div className={styles.link}>
        <Link to="/my-library" className={styles.library}>
          My Library
        </Link>
      </div>
    </header>
  );
};

export default Header;

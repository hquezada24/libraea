import styles from "./Header.module.css";
import SearchBar from "../SearchBar/SearchBar";
import { Link } from "react-router-dom";
import griffinIcon from "../../../assets/griffin.png";

const Header = () => {
  return (
    <header className={styles.header} role="banner">
      <div className={styles.logo}>
        <img
          src={griffinIcon}
          alt="Libraea Griffin Logo"
          className={styles.logoIcon}
          height="40"
        />
        <Link to={"/"} className={styles.logoLink}>
          <h1 className={styles.logoText}>Libraea</h1>
        </Link>
      </div>
      <SearchBar />
      <nav
        className={styles.navigation}
        role="navigation"
        aria-label="Main navigation"
      >
        <Link to="/my-library" className={styles.library}>
          My Library
        </Link>
      </nav>
    </header>
  );
};

export default Header;

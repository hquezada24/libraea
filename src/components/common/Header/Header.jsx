import styles from "./Header.module.css";
import useMobile from "../../../hooks/useMobile";
import { Search } from "lucide-react";

const Header = () => {
  const isMobile = useMobile(768);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <h1>Libraea</h1>
      </div>
      <div className={styles.search}>
        <form action="">
          <input
            type="text"
            placeholder={
              isMobile ? "Search a book" : "Search for your next adventure..."
            }
          />
          <button>
            <Search className={styles.icon} />
          </button>
        </form>
      </div>
      <div className={styles.icons}>
        <img src="../../../src/assets/kitten.png" alt="" />
      </div>
    </header>
  );
};

export default Header;

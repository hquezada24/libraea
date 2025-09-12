import styles from "./Header.module.css";
import { Search } from "lucide-react";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <h1>Libraea</h1>
      </div>
      <div className={styles.search}>
        <form action="">
          <input type="text" placeholder="Search for your next adventure..." />
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

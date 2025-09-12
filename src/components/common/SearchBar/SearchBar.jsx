import styles from "./SearchBar.module.css";
import { Search } from "lucide-react";
import useMobile from "../../../hooks/useMobile";

const SearchBar = () => {
  const isMobile = useMobile(768);

  return (
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
  );
};

export default SearchBar;

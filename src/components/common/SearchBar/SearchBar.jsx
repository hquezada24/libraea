import styles from "./SearchBar.module.css";
import { useState } from "react";
import { Search } from "lucide-react";
import { useSearch } from "../../../hooks/useSearch";
import useMobile from "../../../hooks/useMobile";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const { searchBooks } = useSearch();
  const isMobile = useMobile(768);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchBooks(query);
  };

  return (
    <div className={styles.search}>
      <form action="">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={
            isMobile ? "Search a book" : "Search for your next adventure..."
          }
        />
        <button onClick={handleSubmit}>
          <Search className={styles.icon} />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;

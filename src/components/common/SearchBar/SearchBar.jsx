import styles from "./SearchBar.module.css";
import { useState } from "react";
import { Search } from "lucide-react";
import { useSearch } from "../../../hooks/useSearch";
import useMobile from "../../../hooks/useMobile";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const { searchBooks } = useSearch();
  const isMobile = useMobile(768);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      await searchBooks(query);
      navigate("/search");
    }
  };

  return (
    <div className={styles.search}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={
            isMobile ? "Search a book" : "Search for your next adventure..."
          }
        />
        <button type="submit">
          <Search className={styles.icon} />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;

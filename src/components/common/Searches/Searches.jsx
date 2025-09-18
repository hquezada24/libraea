import { useSearch } from "../../../hooks/useSearch";
import styles from "./Searches.module.css";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Searches = ({ text }) => {
  const { searchBooks } = useSearch();
  const navigate = useNavigate();

  const handleOnClick = async (e) => {
    e.preventDefault();
    if (text.trim()) {
      await searchBooks(text);
      navigate("/search");
    }
  };

  return (
    <button className={styles.search} onClick={handleOnClick}>
      {text}
      <ArrowRight />
    </button>
  );
};

export default Searches;

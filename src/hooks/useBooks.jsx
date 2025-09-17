import { BooksContext } from "../context/BooksContext";
import { useContext } from "react";

export const useBooks = () => {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error("useBooks must be used within a BooksProvider");
  }
  return context;
};

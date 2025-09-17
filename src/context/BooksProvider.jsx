import { useReducer, useEffect } from "react";
import { BooksContext } from "./BooksContext";

const STORAGE_KEY = "savedBooks";

const sanitizeBookForStorage = (book) => {
  // Only keep serializable properties
  const {
    key,
    title,
    author_name,
    first_publish_year,
    cover_edition_key,
    cover_i,
  } = book;

  console.log(book);

  return {
    key,
    title,
    author_name,
    first_publish_year,
    cover_edition_key,
    cover_i,
    // Only include properties that are primitive values or simple arrays
  };
};

const BOOKS_ACTIONS = {
  LOAD: "LOAD",
  ADD: "ADD",
  REMOVE: "REMOVE",
  CLEAR: "CLEAR",
};

const booksReducer = (state, action) => {
  switch (action.type) {
    case BOOKS_ACTIONS.LOAD:
      return action.payload;
    case BOOKS_ACTIONS.ADD: {
      const exists = state.some((book) => book.key === action.payload.key);
      if (exists) return state;
      const cleanBook = sanitizeBookForStorage(action.payload);
      return [...state, cleanBook];
    }
    case BOOKS_ACTIONS.REMOVE:
      return state.filter((book) => book.key !== action.payload);
    case BOOKS_ACTIONS.CLEAR:
      return [];
    default:
      return state;
  }
};

export const BooksProvider = ({ children }) => {
  const [savedBooks, dispatch] = useReducer(booksReducer, []);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        dispatch({ type: BOOKS_ACTIONS.LOAD, payload: JSON.parse(stored) });
      } catch (error) {
        console.error("Failed to parse saved books:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedBooks));
  }, [savedBooks]);

  const addBook = (book) => {
    dispatch({ type: BOOKS_ACTIONS.ADD, payload: book });
  };

  const removeBook = (bookKey) => {
    dispatch({ type: BOOKS_ACTIONS.REMOVE, payload: bookKey });
  };

  const clearBooks = () => {
    dispatch({ type: BOOKS_ACTIONS.CLEAR });
  };
  const isBookSaved = (bookKey) => {
    return savedBooks.some((book) => book.key === bookKey);
  };
  const seeBookList = () => {
    return savedBooks;
  };
  const clearList = () => {
    dispatch({ type: BOOKS_ACTIONS.CLEAR });
  };

  const value = {
    savedBooks,
    addBook,
    removeBook,
    clearBooks,
    isBookSaved,
    seeBookList,
    clearList,
  };

  return (
    <BooksContext.Provider value={value}>{children}</BooksContext.Provider>
  );
};

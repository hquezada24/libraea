import { useReducer, useEffect, useState } from "react";
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
  };
};

const BOOKS_ACTIONS = {
  LOAD: "LOAD",
  ADD_TO_FAVORITES: "ADD_TO_FAVORITES",
  REMOVE_FROM_FAVORITES: "REMOVE_FROM_FAVORITES",
  ADD_TO_WANT_TO_READ: "ADD_TO_WANT_TO_READ",
  REMOVE_FROM_WANT_TO_READ: "REMOVE_FROM_WANT_TO_READ",
  ADD_TO_RECENTLY_SEARCHED: "ADD_TO_RECENTLY_SEARCHED",
  CLEAR: "CLEAR",
};

const booksReducer = (state, action) => {
  switch (action.type) {
    case BOOKS_ACTIONS.LOAD:
      return action.payload;
    case BOOKS_ACTIONS.ADD_TO_FAVORITES: {
      const exists = state.favorites.some(
        (book) => book.key === action.payload.key
      );
      if (exists) return state;
      const cleanBook = sanitizeBookForStorage(action.payload);
      return {
        ...state,
        favorites: [...state.favorites, cleanBook],
      };
    }
    case BOOKS_ACTIONS.REMOVE_FROM_FAVORITES:
      return {
        ...state,
        favorites: state.favorites.filter(
          (book) => book.key !== action.payload
        ),
      };
    case BOOKS_ACTIONS.ADD_TO_WANT_TO_READ: {
      const exists = state.wantToRead.some(
        (book) => book.key === action.payload.key
      );
      if (exists) return state;
      const cleanBook = sanitizeBookForStorage(action.payload);
      return {
        ...state,
        wantToRead: [...state.wantToRead, cleanBook],
      };
    }
    case BOOKS_ACTIONS.REMOVE_FROM_WANT_TO_READ: {
      return {
        ...state,
        wantToRead: state.wantToRead.filter(
          (book) => book.key !== action.payload
        ),
      };
    }
    case BOOKS_ACTIONS.ADD_TO_RECENTLY_SEARCHED: {
      const exists = state.recentlySearched.some(
        (searchQuery) => searchQuery.id === action.payload.id
      );
      if (exists) {
        // Move to front if already exists
        const filtered = state.recentlySearched.filter(
          (searchQuery) => searchQuery.id !== action.payload.id
        );
        return {
          ...state,
          recentlySearched: [action.payload, ...filtered].slice(0, 5), // Keep only last 20
        };
      }

      return {
        ...state,
        recentlySearched: [action.payload, ...state.recentlySearched].slice(
          0,
          5
        ), // Keep only last 20
      };
    }
    case BOOKS_ACTIONS.CLEAR: {
      return {
        ...state,
        [action.payload]: [],
      };
    }
    default:
      return state;
  }
};

const initialState = {
  favorites: [],
  wantToRead: [],
  recentlySearched: [],
};

export const BooksProvider = ({ children }) => {
  const [savedBooks, dispatch] = useReducer(booksReducer, initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedData = JSON.parse(stored);
        // Ensure all required properties exist
        const completeData = {
          favorites: parsedData.favorites || [],
          wantToRead: parsedData.wantToRead || [],
          recentlySearched: parsedData.recentlySearched || [],
        };
        dispatch({ type: BOOKS_ACTIONS.LOAD, payload: completeData });
      } catch (error) {
        console.error("Failed to parse saved books:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedBooks));
    }
  }, [savedBooks, isLoaded]);

  // Helper functions
  const addToFavorites = (book) => {
    dispatch({ type: BOOKS_ACTIONS.ADD_TO_FAVORITES, payload: book });
  };

  const removeFromFavorites = (bookKey) => {
    dispatch({ type: BOOKS_ACTIONS.REMOVE_FROM_FAVORITES, payload: bookKey });
  };

  const addToWantToRead = (book) => {
    dispatch({ type: BOOKS_ACTIONS.ADD_TO_WANT_TO_READ, payload: book });
  };

  const removeFromWantToRead = (bookKey) => {
    dispatch({
      type: BOOKS_ACTIONS.REMOVE_FROM_WANT_TO_READ,
      payload: bookKey,
    });
  };
  const addToRecentlySearched = (query) => {
    dispatch({ type: BOOKS_ACTIONS.ADD_TO_RECENTLY_SEARCHED, payload: query });
  };

  const clearList = (listName) => {
    dispatch({ type: BOOKS_ACTIONS.CLEAR, payload: listName });
  };

  // Check functions
  const isFavorite = (bookKey) => {
    return savedBooks.favorites.some((book) => book.key === bookKey);
  };

  const isInWantToRead = (bookKey) => {
    return savedBooks.wantToRead.some((book) => book.key === bookKey);
  };

  const isInRecentlySearched = (bookKey) => {
    return savedBooks.recentlySearched.some((book) => book.key === bookKey);
  };

  const value = {
    // Data
    favorites: savedBooks.favorites,
    wantToRead: savedBooks.wantToRead,
    recentlySearched: savedBooks.recentlySearched,

    // Actions
    addToFavorites,
    removeFromFavorites,
    addToWantToRead,
    removeFromWantToRead,
    addToRecentlySearched,
    clearList,

    // Checks
    isFavorite,
    isInWantToRead,
    isInRecentlySearched,
  };

  return (
    <BooksContext.Provider value={value}>{children}</BooksContext.Provider>
  );
};

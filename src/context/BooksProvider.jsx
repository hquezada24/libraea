import { useReducer, useEffect, useState, useMemo, useCallback } from "react";
import { BooksContext } from "./BooksContext";

const STORAGE_KEY = "libraea_saved_books";

// Move constants outside component to prevent recreation
const BOOKS_ACTIONS = {
  LOAD: "LOAD",
  ADD_TO_FAVORITES: "ADD_TO_FAVORITES",
  REMOVE_FROM_FAVORITES: "REMOVE_FROM_FAVORITES",
  ADD_TO_WANT_TO_READ: "ADD_TO_WANT_TO_READ",
  REMOVE_FROM_WANT_TO_READ: "REMOVE_FROM_WANT_TO_READ",
  ADD_TO_RECENTLY_SEARCHED: "ADD_TO_RECENTLY_SEARCHED",
  CLEAR: "CLEAR",
  SET_ERROR: "SET_ERROR",
};

const MAX_RECENT_SEARCHES = 5;

// Utility functions
const sanitizeBookForStorage = (book) => {
  const {
    key,
    title,
    author_name,
    first_publish_year,
    cover_edition_key,
    cover_i,
  } = book;

  return {
    key,
    title: title || "Unknown Title",
    author_name: author_name || ["Unknown Author"],
    first_publish_year: first_publish_year || null,
    cover_edition_key,
    cover_i,
  };
};

const safeJSONParse = (str, fallback = {}) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return fallback;
  }
};

const safeLocalStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error("LocalStorage getItem failed:", error);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error("LocalStorage setItem failed:", error);
    }
  },
};

const booksReducer = (state, action) => {
  switch (action.type) {
    case BOOKS_ACTIONS.LOAD:
      return { ...state, ...action.payload, error: null };

    case BOOKS_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };

    case BOOKS_ACTIONS.ADD_TO_FAVORITES: {
      const exists = state.favorites.some(
        (book) => book.key === action.payload.key
      );
      if (exists) return state;

      const cleanBook = sanitizeBookForStorage(action.payload);
      return {
        ...state,
        favorites: [...state.favorites, cleanBook],
        error: null,
      };
    }

    case BOOKS_ACTIONS.REMOVE_FROM_FAVORITES:
      return {
        ...state,
        favorites: state.favorites.filter(
          (book) => book.key !== action.payload
        ),
        error: null,
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
        error: null,
      };
    }

    case BOOKS_ACTIONS.REMOVE_FROM_WANT_TO_READ:
      return {
        ...state,
        wantToRead: state.wantToRead.filter(
          (book) => book.key !== action.payload
        ),
        error: null,
      };

    case BOOKS_ACTIONS.ADD_TO_RECENTLY_SEARCHED: {
      const filtered = state.recentlySearched.filter(
        (query) => query.id !== action.payload.id
      );

      return {
        ...state,
        recentlySearched: [action.payload, ...filtered].slice(
          0,
          MAX_RECENT_SEARCHES
        ),
        error: null,
      };
    }

    case BOOKS_ACTIONS.CLEAR:
      return {
        ...state,
        [action.payload]: [],
        error: null,
      };

    default:
      return state;
  }
};

const initialState = {
  favorites: [],
  wantToRead: [],
  recentlySearched: [],
  error: null,
};

export const BooksProvider = ({ children }) => {
  const [savedBooks, dispatch] = useReducer(booksReducer, initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const stored = safeLocalStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedData = safeJSONParse(stored, {});
          const completeData = {
            favorites: parsedData.favorites || [],
            wantToRead: parsedData.wantToRead || [],
            recentlySearched: parsedData.recentlySearched || [],
          };
          dispatch({ type: BOOKS_ACTIONS.LOAD, payload: completeData });
        }
      } catch (error) {
        dispatch({
          type: BOOKS_ACTIONS.SET_ERROR,
          payload: `${error} Failed to load saved books`,
        });
      } finally {
        setIsLoaded(true);
      }
    };

    loadSavedData();
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (isLoaded) {
      const dataToSave = {
        favorites: savedBooks.favorites,
        wantToRead: savedBooks.wantToRead,
        recentlySearched: savedBooks.recentlySearched,
      };
      safeLocalStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [
    savedBooks.favorites,
    savedBooks.wantToRead,
    savedBooks.recentlySearched,
    isLoaded,
  ]);

  // Memoized action functions to prevent unnecessary re-renders
  const addToFavorites = useCallback((book) => {
    if (!book?.key) {
      dispatch({
        type: BOOKS_ACTIONS.SET_ERROR,
        payload: "Invalid book data",
      });
      return;
    }
    dispatch({ type: BOOKS_ACTIONS.ADD_TO_FAVORITES, payload: book });
  }, []);

  const removeFromFavorites = useCallback((bookKey) => {
    if (!bookKey) return;
    dispatch({ type: BOOKS_ACTIONS.REMOVE_FROM_FAVORITES, payload: bookKey });
  }, []);

  const addToWantToRead = useCallback((book) => {
    if (!book?.key) {
      dispatch({
        type: BOOKS_ACTIONS.SET_ERROR,
        payload: "Invalid book data",
      });
      return;
    }
    dispatch({ type: BOOKS_ACTIONS.ADD_TO_WANT_TO_READ, payload: book });
  }, []);

  const removeFromWantToRead = useCallback((bookKey) => {
    if (!bookKey) return;
    dispatch({
      type: BOOKS_ACTIONS.REMOVE_FROM_WANT_TO_READ,
      payload: bookKey,
    });
  }, []);

  const addToRecentlySearched = useCallback((query) => {
    if (!query?.id) return;
    dispatch({ type: BOOKS_ACTIONS.ADD_TO_RECENTLY_SEARCHED, payload: query });
  }, []);

  const clearList = useCallback((listName) => {
    if (!["favorites", "wantToRead", "recentlySearched"].includes(listName)) {
      dispatch({
        type: BOOKS_ACTIONS.SET_ERROR,
        payload: "Invalid list name",
      });
      return;
    }
    dispatch({ type: BOOKS_ACTIONS.CLEAR, payload: listName });
  }, []);

  // Memoized check functions
  const isFavorite = useCallback(
    (bookKey) => {
      return savedBooks.favorites.some((book) => book.key === bookKey);
    },
    [savedBooks.favorites]
  );

  const isInWantToRead = useCallback(
    (bookKey) => {
      return savedBooks.wantToRead.some((book) => book.key === bookKey);
    },
    [savedBooks.wantToRead]
  );

  const isInRecentlySearched = useCallback(
    (bookKey) => {
      return savedBooks.recentlySearched.some((query) => query.id === bookKey);
    },
    [savedBooks.recentlySearched]
  );

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      // Data
      favorites: savedBooks.favorites,
      wantToRead: savedBooks.wantToRead,
      recentlySearched: savedBooks.recentlySearched,
      error: savedBooks.error,
      isLoaded,

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
    }),
    [
      savedBooks,
      isLoaded,
      addToFavorites,
      removeFromFavorites,
      addToWantToRead,
      removeFromWantToRead,
      addToRecentlySearched,
      clearList,
      isFavorite,
      isInWantToRead,
      isInRecentlySearched,
    ]
  );

  return (
    <BooksContext.Provider value={contextValue}>
      {children}
    </BooksContext.Provider>
  );
};

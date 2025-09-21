import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NotFound.module.css";
import { ArrowLeft, Home, Search, BookOpen } from "lucide-react";
import Button from "../../components/common/Button/Button";

const NotFound = () => {
  const navigate = useNavigate();

  // Set page title for better SEO and user experience
  useEffect(() => {
    document.title = "Page Not Found - Libraea";

    // Clean up when component unmounts
    return () => {
      document.title = "Libraea - Track Your Reading Universe";
    };
  }, []);

  const handleGoBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const handleKeyboardShortcuts = (event) => {
    // Add keyboard shortcuts for better accessibility
    if (event.key === "h" || event.key === "H") {
      navigate("/");
    } else if (event.key === "s" || event.key === "S") {
      navigate("/search");
    } else if (event.key === "Escape") {
      handleGoBack();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboardShortcuts);
    return () =>
      document.removeEventListener("keydown", handleKeyboardShortcuts);
  }, []);

  return (
    <div className={styles.notFound} role="main">
      <div className={styles.overlay} aria-hidden="true"></div>

      <div className={styles.content}>
        <div className={styles.errorSection}>
          <div className={styles.errorCode} aria-label="Error code">
            404
          </div>
          <h1 className={styles.errorTitle}>Page Not Found</h1>
          <p className={styles.errorDescription}>
            Let's help you find your way back to the books!
          </p>
        </div>

        <div className={styles.actionsSection}>
          <div className={styles.primaryActions}>
            <Button
              text="Back Home"
              link="/"
              className={styles.homeButton}
              aria-label="Go back to home page"
            >
              <Home className={styles.buttonIcon} aria-hidden="true" />
              Back Home
            </Button>

            <button
              onClick={handleGoBack}
              className={styles.backButton}
              type="button"
              aria-label="Go back to previous page"
            >
              <ArrowLeft className={styles.buttonIcon} aria-hidden="true" />
              Go Back
            </button>
          </div>

          <div className={styles.secondaryActions}>
            <Button
              text="Search Books"
              link="/search"
              className={styles.searchButton}
              aria-label="Go to book search"
            >
              <Search className={styles.buttonIcon} aria-hidden="true" />
              Search Books
            </Button>

            <Button
              text="My Library"
              link="/my-library"
              className={styles.libraryButton}
              aria-label="Go to my library"
            >
              <BookOpen className={styles.buttonIcon} aria-hidden="true" />
              My Library
            </Button>
          </div>
        </div>

        <div className={styles.helpSection}>
          <h2 className={styles.helpTitle}>Quick Navigation</h2>
          <div className={styles.shortcuts}>
            <kbd className={styles.kbd}>H</kbd> Home
            <kbd className={styles.kbd}>S</kbd> Search
            <kbd className={styles.kbd}>Esc</kbd> Go Back
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

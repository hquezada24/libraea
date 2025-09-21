import { useState, useEffect } from "react";
import styles from "./Hero.module.css";
import useMobile from "../../hooks/useMobile";
import Button from "../common/Button/Button";
import { BookOpen, Star, Bookmark } from "lucide-react";

const Hero = () => {
  const isMobile = useMobile(768);
  const [isVisible, setIsVisible] = useState(false);

  // Animation trigger on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <BookOpen className={styles.featureIcon} aria-hidden="true" />,
      text: "Track Books",
    },
    {
      icon: <Star className={styles.featureIcon} aria-hidden="true" />,
      text: "Save Favorites",
    },
    {
      icon: <Bookmark className={styles.featureIcon} aria-hidden="true" />,
      text: "Find new books",
    },
  ];

  return (
    <section className={styles.hero} role="banner" aria-labelledby="hero-title">
      <div className={styles.overlay} aria-hidden="true" />

      <div className={`${styles.content} ${isVisible ? styles.visible : ""}`}>
        <h1 id="hero-title" className={styles.title}>
          Track Your Reading Universe
        </h1>

        <p className={styles.subtitle}>
          {isMobile
            ? "Discover, organize, and celebrate your literary journey"
            : "Discover, organize, and celebrate your literary journey with the ultimate book tracking experience"}
        </p>

        {/* Feature highlights */}
        <div className={styles.features} aria-label="Key features">
          {features.map((feature) => (
            <div key={feature.text} className={styles.feature}>
              {feature.icon}
              <span className={styles.featureText}>{feature.text}</span>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <Button
            text="View My Library"
            link="/my-library"
            className={styles.primaryButton}
            aria-label="Go to my personal library"
          />

          {!isMobile && (
            <Button
              text="Start Exploring"
              link="/search"
              className={styles.secondaryButton}
              aria-label="Start searching for books"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;

import styles from "./Hero.module.css";
import useMobile from "../../hooks/useMobile";
import Button from "../common/Button/Button";

const Hero = () => {
  const isMobile = useMobile(768);

  return (
    <div className={styles.hero}>
      <h2>Track Your Reading Universe</h2>
      <h3>
        {isMobile
          ? "Save favorites, track your progress..."
          : "Discover, organize, and celebrate your literary journey with the ultimate book tracking experience"}
      </h3>
      <Button text={"View My Library"} />
      <button
        class={styles.likeButton}
        data-post-id="12345"
        aria-pressed="false"
      >
        <span class={styles.icon}>♡</span>
        <span class={styles.count}>1,237</span>
      </button>
    </div>
  );
};

export default Hero;

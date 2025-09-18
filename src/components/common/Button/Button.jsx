import styles from "./Button.module.css";
import { Link } from "react-router-dom";

const Button = ({ text, link = "" }) => {
  return (
    <button className={styles.button}>
      {link ? (
        <Link to={link} className={styles.link}>
          {text}
        </Link>
      ) : (
        <span className={styles.span}>{text}</span>
      )}
    </button>
  );
};

export default Button;

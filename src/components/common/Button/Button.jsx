import styles from "./Button.module.css";
import { Link } from "react-router-dom";

const Button = ({ text, link = "", onClick = "" }) => {
  return (
    <button className={styles.button} onClick={onClick ? onClick : ""}>
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

import styles from "./Button.module.css";

const Button = ({ text, link = "" }) => {
  return (
    <button className={styles.button}>
      {link ? (
        <a href={link} className={styles.link}>
          {text}
        </a>
      ) : (
        <span className={styles.span}>{text}</span>
      )}
    </button>
  );
};

export default Button;

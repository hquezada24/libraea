import styles from "./Searches.module.css";

const Searches = ({ text }) => {
  return <p className={styles.search}>{text}</p>;
};

export default Searches;

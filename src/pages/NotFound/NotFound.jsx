import styles from "./NotFound.module.css";
import { ArrowLeft } from "lucide-react";
import Button from "../../components/common/Button/Button";

const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <div className={styles.nothing}>
        <h2>There is nothing here</h2>
        <Button text={`Back Home`} link="/"></Button>
      </div>
    </div>
  );
};

export default NotFound;

import styles from "./Home.module.css";
import Hero from "../../components/Hero/Hero";
import Dashboard from "../../components/Dashboard/Dashboard";

const Home = () => {
  return (
    <div className={styles.home}>
      <Hero />
      <Dashboard />
    </div>
  );
};

export default Home;

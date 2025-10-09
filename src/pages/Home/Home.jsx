import styles from "./Home.module.css";
import Hero from "../../components/Hero/Hero";
import Dashboard from "../../components/Dashboard/Dashboard";

const Home = () => {
  return (
    <main className={styles.home}>
      <Hero />
      <Dashboard />
    </main>
  );
};

export default Home;

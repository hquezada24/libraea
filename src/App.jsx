import "./App.css";
import Header from "./components/common/Header/Header";
import { SearchProvider } from "./context/SearchProvider";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <SearchProvider>
      <Header />
      <main className="app-container">
        <Outlet />
      </main>
    </SearchProvider>
  );
}

export default App;

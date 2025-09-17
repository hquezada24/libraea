import "./App.css";
import Header from "./components/common/Header/Header";
import { SearchProvider } from "./context/SearchProvider";
import { BooksProvider } from "./context/BooksProvider";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <SearchProvider>
      <BooksProvider>
        <Header />
        <main className="app-container">
          <Outlet />
        </main>
      </BooksProvider>
    </SearchProvider>
  );
}

export default App;

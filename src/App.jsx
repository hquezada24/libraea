import "./App.css";
import Home from "./pages/Home";
import SearchBook from "./pages/SearchBook/SearchBook";
import { SearchProvider } from "./context/SearchProvider";

function App() {
  return (
    <SearchProvider>
      <div className="app-container">
        <Home />
        <SearchBook />
      </div>
    </SearchProvider>
  );
}

export default App;

import App from "./App";
import Home from "./pages/Home";
import SearchBook from "./pages/SearchBook/SearchBook";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true, // This makes Home the default child route
        element: <Home />,
      },
      {
        path: "/search",
        element: <SearchBook />,
      },
    ],
  },
];

export default routes;

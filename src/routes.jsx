import App from "./App";
import Home from "./pages/Home/Home";
import SearchBook from "./pages/SearchBook/SearchBook";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
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

import App from "./App";
import Home from "./pages/Home/Home";
import SearchBook from "./pages/SearchBook/SearchBook";
import MyLibrary from "./pages/MyLibrary/MyLibrary";
import NotFound from "./pages/NotFound/NotFound";

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
      {
        path: "/my-library",
        element: <MyLibrary />,
      },
      {
        path: "/*",
        element: <NotFound />,
      },
    ],
  },
];

export default routes;

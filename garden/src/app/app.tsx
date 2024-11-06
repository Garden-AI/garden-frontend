import { RouterProvider } from "react-router";
import { createHashRouter } from "react-router-dom";

import Router from "./router";

const App = () => {
  return (
    <RouterProvider
      router={createHashRouter([
        {
          path: "*",
          element: <Router />,
        },
      ])}
    />
  );
};

export default App;

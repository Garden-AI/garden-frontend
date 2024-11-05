import { RouterProvider } from "react-router";
import { createHashRouter } from "react-router-dom";
import Router from "./router";

export default function App() {
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
}

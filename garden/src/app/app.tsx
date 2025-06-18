import React from "react";
import { RouterProvider } from "react-router-dom";
import { createHashRouter } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Router from "./router";

const App = () => {
  return (
    <>
      <RouterProvider
        router={createHashRouter([
          {
            path: "*",
            element: <Router />,
          },
        ])}
      />
      <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
    </>
  );
};

export default App;
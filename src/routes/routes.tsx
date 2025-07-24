import { createBrowserRouter } from "react-router-dom";
import Mainlayout from "../layouts/Mainlayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Mainlayout />,
  },
]);

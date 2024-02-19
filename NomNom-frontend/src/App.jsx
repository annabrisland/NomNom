import "./App.css";
import InputScreen from "./screens/InputScreen";
import StatScreen from "./screens/StatScreen";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <InputScreen />,
    },
    {
      path: "/stats",
      element: <StatScreen />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

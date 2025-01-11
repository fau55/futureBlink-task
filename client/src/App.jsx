import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import HomePage from "./components/HomePage/HomePage";
import Register from "./components/Login-Register/Register/Register";
import Login from "./components/Login-Register/Login/Login";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;

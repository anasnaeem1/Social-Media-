import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SkeletonTheme } from "react-loading-skeleton";
import { useContext } from "react";
import { AuthContext } from "./components/context/AuthContext";
import Home from "./components/Pages/Home/home";
import Profile from "./components/Pages/Profile/profile";
import Search from "./components/Pages/Search/search";
import Login from "./components/Pages/login/login";
import Register from "./components/Pages/Register/register";
import Navbar from "./components/Header/navbar";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <div
      className="bg-gray-50"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <SkeletonTheme baseColor="#D4D9E1" highlightColor="#dde2e9">
        <Router>
          {user ? <Navbar /> : undefined}
          <Routes>
            <Route
              path="/"
              element={!user ? <Navigate to="/register" /> : <Home />}
            />
            <Route
              path="/profile/:id"
              element={!user ? <Navigate to="/register" /> : <Profile />}
            />
            <Route
              path="/search/:id"
              element={!user ? <Navigate to="/register" /> : <Search />}
            />
            <Route
              path="/login"
              element={user ? <Navigate to="/" /> : <Login />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/" /> : <Register />}
            />
          </Routes>
        </Router>
      </SkeletonTheme>
    </div>
  );
}

export default App;
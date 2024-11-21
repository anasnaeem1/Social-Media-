import Home from "./components/Pages/Home/home";
import Profile from "./components/Pages/Profile/profile";
import Login from "./components/Pages/login/login";
import Register from "./components/Pages/Register/register";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SkeletonTheme } from "react-loading-skeleton";
import { useContext } from "react";
import { AuthContext } from "./components/context/AuthContext";

function App() {
  const { user } = useContext(AuthContext);
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  return (
    <div style={{ fontFamily: "Montserrat, sans-serif" }}>
      <SkeletonTheme baseColor="#D4D9E1" highlightColor="#dde2e9">
        <Router>
          <Routes>
            <Route path="/" element={user ? <Home /> : <Register />} />
            <Route
              path="/login"
              element={user ? <Navigate to="/" /> : <Login />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/" /> : <Register />}
            />
            <Route path="/profile/:username" element={user ? <Profile /> : <Navigate to="/login" />} />
          </Routes>
        </Router>
      </SkeletonTheme>
    </div>
  );
}

export default App;

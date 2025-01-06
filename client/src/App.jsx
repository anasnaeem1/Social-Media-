import { useEffect, useContext, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SkeletonTheme } from "react-loading-skeleton";
import { AuthContext } from "./components/context/AuthContext";
import io from "socket.io-client";
import Home from "./components/Pages/Home/home";
import ViewPhoto from "./components/Pages/viewPhoto/viewPhoto";
import Profile from "./components/Pages/Profile/profile";
import Search from "./components/Pages/Search/search";
import Login from "./components/Pages/login/login";
import Register from "./components/Pages/Register/register";
import Navbar from "./components/Header/navbar";
import MessagesPage from "./components/Pages/MessagePage/messagesMain";
import ScrollToTop from "./components/scrollToTop";

function App() {
  const { user } = useContext(AuthContext);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    if (user) {
      socket.current.emit("addUser", user._id);
      socket.current.on("getUsers", (users) => {
        // console.log("Online users:", users);
      });
    }
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [user]);

  return (
    <div
      className="bg-gray-50"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <SkeletonTheme baseColor="#D4D9E1" highlightColor="#dde2e9">
        <Router>
          {user ? <ScrollToTop /> : undefined}
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
              path="/photo/:photoName"
              element={!user ? <Navigate to="/register" /> : <ViewPhoto />}
            />
            <Route
              path="/messages"
              element={!user ? <Navigate to="/register" /> : <MessagesPage />}
            >
              <Route
                path=":convoId"
                element={!user ? <Navigate to="/register" /> : <MessagesPage />}
              />
            </Route>
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

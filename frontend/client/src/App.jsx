import { useEffect, useContext, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SkeletonTheme } from "react-loading-skeleton";
import { UserContext } from "./components/context/UserContext";
import io from "socket.io-client";
import Home from "./components/Pages/Home/home";
import ViewPhoto from "./components/Pages/viewPhoto/viewPhoto";
import Profile from "./components/Pages/Profile/profile";
// import Search from "./components/Pages/Search/search";
import Login from "./components/Pages/signingPage/login/login";
import Register from "./components/Pages/signingPage/register/register";
import Navbar from "./components/Header/navbar";
import MessagesPage from "./components/Pages/MessagePage/messagesMain";

function App() {
  const { user } = useContext(UserContext);
  // const socket = useRef(null);

  // useEffect(() => {
  //   socket.current = io("ws://localhost:8900");
  //   if (user) {
  //     socket.current.emit("addUser", user._id);
  //     socket.current.on("getUsers", (users) => {
  //       // console.log("Online users:", users);
  //     });
  //   }
  //   return () => {
  //     if (socket.current) {
  //       socket.current.disconnect();
  //     }
  //   };
  // }, [user]);

  return (
    <div
    className="bg-gray-50 min-h-screen"
    style={{ fontFamily: "Montserrat, sans-serif" }}
  >
    <SkeletonTheme baseColor="#D4D9E1" highlightColor="#dde2e9">
      <Router>
        {user && <Navbar />}
        <Routes>
          <Route
            path="/"
            element={!user ? <Navigate to="/login" /> : <Home />}
          >
            <Route
              path="/search/:searchInput"
              element={!user ? <Navigate to="/login" /> : <Home />}
            />
            <Route
              path=":postId"
              element={!user ? <Navigate to="/login" /> : <Home />}
            >
            
              <Route
                path=":commentId"
                element={!user ? <Navigate to="/login" /> : <Home />}
              />
            </Route>
            <Route
              path="/friends"
              element={!user ? <Navigate to="/login" /> : <Home />}
            ></Route>
          </Route>
          <Route
            path="/profile/:userId"
            element={!user ? <Navigate to="/login" /> : <Profile />}
          >
            <Route
              path=":postId"
              element={!user ? <Navigate to="/login" /> : <Profile />}
            >
              <Route
                path=":commentId"
                element={!user ? <Navigate to="/login" /> : <Profile />}
              />
            </Route>
          </Route>
          <Route path="photo/:viewPhoto/:photoId" element={<ViewPhoto />} />
          <Route
            path="/messages"
            element={!user ? <Navigate to="/login" /> : <MessagesPage />}
          >
            <Route
              path=":convoId"
              element={!user ? <Navigate to="/login" /> : <MessagesPage />}
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

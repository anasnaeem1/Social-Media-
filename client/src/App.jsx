import Home from "./components/Pages/Home/home";
import Profile from "./components/Pages/Profile/profile";
import Login from "./components/Pages/login/login";
import Register from "./components/Pages/Register/register";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";

function App() {
 
  return (
    <div style={{ fontFamily: "Montserrat, sans-serif" }}>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile/:username" element={<Profile />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

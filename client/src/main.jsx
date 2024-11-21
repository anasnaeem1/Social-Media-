// index.js or index.tsx
import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./components/context/AuthContext";

// Remove or comment out the StrictMode wrapper to stop the double render
ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
);

// ReactDOM.createRoot(document.getElementById("root")).render(<App />);

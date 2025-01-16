// index.js or index.tsx
import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserContextProvider } from "./components/context/UserContext";

// Remove or comment out the StrictMode wrapper to stop the double render
ReactDOM.createRoot(document.getElementById("root")).render(
  <UserContextProvider>
    <App />
  </UserContextProvider>
);

// ReactDOM.createRoot(document.getElementById("root")).render(<App />);

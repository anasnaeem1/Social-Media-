// index.js or index.tsx
import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserContextProvider } from "./components/context/UserContext";
import { FeedContextProvider } from "./components/context/FeedContext";

// Remove or comment out the StrictMode wrapper to stop the double render
ReactDOM.createRoot(document.getElementById("root")).render(
  <UserContextProvider>
    <FeedContextProvider>
      <App />
    </FeedContextProvider>
  </UserContextProvider>
);

// ReactDOM.createRoot(document.getElementById("root")).render(<App />);

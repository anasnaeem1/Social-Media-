import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  SearchedUser: null,
  reload: false,
  isOverlayVisible: false, // Overlay visibility state
  isFetching: false,
  error: false,
  yourNewMessage:null
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("user");
    }
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        ...state, // Spread to include all state properties
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

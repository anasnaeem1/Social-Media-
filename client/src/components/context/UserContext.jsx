import { createContext, useEffect, useReducer } from "react";
import UserReducer from "./UserReducer";

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  SearchedUser: null,
  reload: false,
  uploadProfileBox: false,
  commentBox: false,
  newComment: null,
  newPost: null,
  isFetching: false,
  error: false,
  yourNewMessage:null
};

export const UserContext = createContext(INITIAL_STATE);

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(UserReducer, INITIAL_STATE);

  useEffect(() => {
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("user");
    }
  }, [state.user]);

  return (
    <UserContext.Provider
      value={{
        ...state, // Spread to include all state properties
        dispatch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

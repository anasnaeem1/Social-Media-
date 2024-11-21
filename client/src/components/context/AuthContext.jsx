import { createContext, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
  user: {
    _id: "673a3277a42f1c300d399772",
    bio: "",
    city: "Karachi",
    coverPic: "",
    createdAt: "2024-11-17T18:14:15.584Z",
    email: "anas@gmail.com",
    followers: [],
    followings: (2)[("673148ec2eb15da95ed0e4f3", "672fe575d7b36aee33725e76")],
    from: "Bahadur Abad",
    isAdmin: false,
    password: "$2b$10$0cezYqOhEWtt8zZ5.FL8Ke9762BG5kn0wlhGDp0S9aw1vPNBPxTlu",
    profilePic: "anas.jpg",
    relationship: 2,
    updatedAt: "2024-11-19T12:41:05.675Z",
    username: "Anas",
    __v: 0,
  },
  isFetching: false,
  error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

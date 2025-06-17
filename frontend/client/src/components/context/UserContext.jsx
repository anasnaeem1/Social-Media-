import { createContext, useEffect, useReducer, useRef } from "react";
import UserReducer from "./UserReducer";

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  postDetails: {},
  PhotoCommentsOpen : false,
  SearchedUser: null,
  reload: false,
  uploadProfileBox: false,
  commentBox: false,
  newPost: null,
  isFetching: false,
  birthdayFriends: [],
  error: false,
  searchedInput: null,
  postId: null,
  loadedPosts: [],
  yourNewPost: null,
  newComment: null,
  newUpdateInProfile: {},
  floatingBox: { disable: true, purpose: "", details: null, result: {} },
  scrollPosition: 0,
  mobileSearchInput: false,
  yourNewMessage: null,
};

export const UserContext = createContext(INITIAL_STATE);

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(UserReducer, INITIAL_STATE);
  const isFirstRender = useRef(true); // Track first render

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("user");
    }
  }, [state.user]);

  return (
    <UserContext.Provider value={{ ...state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

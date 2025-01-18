// Action creators for login, follow, and logout actions
export const LoginStart = (userCredentials) => ({
  type: "LOGIN_START",
});

export const LoginSuccess = (user) => ({
  type: "LOGIN_SUCCESS",
  payload: user,
});

export const LoginFailure = (error) => ({
  type: "LOGIN_FAILURE",
  payload: error,
});

export const Follow = (userId) => {
  console.log("Dispatching FOLLOW with userId:", userId);
  return {
    type: "FOLLOW",
    payload: userId,
  };
};

export const Unfollow = (userId) => ({
  type: "UNFOLLOW",
  payload: userId,
});

export const updateProfilePicture = (userId) => {
  console.log("Dispatching FOLLOW with userId:", userId);
  return {
    type: "UPDATEPROFILEPIC",
    payload: userId,
  };
};

// Action for logout
export const Logout = () => ({
  type: "LOGOUT",
});

// Action for Search
export const SearchStart = (username) => ({
  type: "SEARCH",
});

export const SearchSuccess = (user) => ({
  type: "SEARCH_SUCCESS",
  payload: user,
});

export const SearchFailure = (error) => ({
  type: "SEARCH_FAILURE",
  payload: error,
});
export const Reload = (reload) => ({
  type: "RELOAD",
  payload: reload,
});

export const UnReload = (unreload) => ({
  type: "UNRELOAD",
  payload: unreload,
});

// Action creators for overlay management
export const ShowUpdateProfileBox = () => ({
  type: "SHOW_UPLOADPROFILEBOX",
});


export const HideUpdateProfileBox = () => ({
  type: "HIDE_UPLOADPROFILEBOX",
});

// Action creators for overlay management
export const ShowCommentsBox = () => ({
  type: "SHOW_COMMENTSBOX",
});


export const HideCommentsBox = () => ({
  type: "HIDE_COMMENTSBOX",
});

export const YourNewMessage = (message) => ({
  type: "YOUR_NEW_MESSAGE",
  payload: message,
});

export const YourNewComment = (comment) => ({
  type: "YOUR_NEW_COMMENT",
  payload: comment,
});

export const YourNewPost = (post) => ({
  type: "YOUR_NEW_POST",
  payload: post,
});

export const setSearchInput = (input) => ({
  type: "SEARCHEDINPUT",
  payload: input,
});
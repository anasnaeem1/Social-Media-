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

export const setYourNewPost = (post) => ({
  type: "YOURNEWPOST",
  payload: post,
});
export const yourNewComment = (comment) => ({
  type: "YOURNEWCOMMENT",
  payload: comment,
});

export const setPostID = (post) => ({
  type: "POSTID",
  payload: post,
});

export const setMobileSearchInput = (boolean) => ({
  type: "MOBILESEARCHINPUT",
  payload: boolean,
});

export const setLoadedPosts = (feedRef) => ({
  type: "UPDATELOADEDPOST",
  payload: feedRef,
});

export const setScrollPosition = (scrollPosition) => ({
  type: "SET_SCROLL_POSITION",
  payload: scrollPosition,
});

export const setBirthdayFriends = (birthdayFriends) => ({
  type: "UPDATEBIRTHDAYFRIENDS",
  payload: birthdayFriends,
});

export const setPostDetails = (postDetails) => ({
  type: "UPDATEPOSTDETAILS",
  payload: postDetails,
});

export const setNewUpdateInProfile = (newUpdateInProfile) => ({
  type: "YOURNEWUPDATEDINPROFILE",
  payload: newUpdateInProfile,
});

export const updateUser = (updatedUser) => ({
  type: "UPDATE_USER",
  payload: updatedUser,
});
export const toggleFloatingBox = (purpose) => ({
  type: "TOGGLEFLOATINGBOX",
  payload: purpose,
});
export const togglePhotoComments = (visiblility) => ({
  type: "TOGGLE_PHOTO_COMMENTS",
  payload: visiblility,
});
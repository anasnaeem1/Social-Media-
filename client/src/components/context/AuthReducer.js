const AuthReducer = (state, action) => {
  console.log("AuthReducer action:", action.type, "Payload:", action.payload);
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        isFetching: true,
        error: false,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isFetching: false,
        error: false,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        isFetching: false,
        error: action.payload, // Store the error message in the state
      };
    case "FOLLOW":
      console.log("Before FOLLOW:", state.user.followings);
      const updatedFollowings = [...state.user.followings, action.payload];
      console.log("After FOLLOW:", updatedFollowings);
      return {
        ...state,
        user: {
          ...state.user,
          followings: updatedFollowings,
        },
      };
    case "UNFOLLOW":
      return {
        ...state,
        user: {
          ...state.user,
          followings: state.user.followings.filter(
            (following) => following !== action.payload
          ),
        },
      };
    case "LOGOUT": // Added LOGOUT case to handle logout
      return {
        ...state,
        user: null, // Reset user state to null
        isFetching: false,
        error: false,
      };
    default:
      return state;
  }
};

export default AuthReducer;

import { YourNewMessage } from "./UserActions";

const AuthReducer = (state, action) => {
  // console.log("AuthReducer action:", action.type, "Payload:", action.payload);
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state, // Preserve the existing state
        user: null,
        isFetching: true,
        error: false,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isFetching: false,
        error: false,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        isFetching: false,
        error: action.payload,
      };
    case "FOLLOW":
      // console.log("Before FOLLOW:", state.user.followings);
      const updatedFollowings = [...state.user.followings, action.payload];
      // console.log("After FOLLOW:", updatedFollowings);
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
    case "UPDATEPROFILEPIC":
      return {
        ...state,
        user: {
          ...state.user,
          profilePic: action.payload, // Update profile picture
        },
      };
    case "LOGOUT": // Handle logout
      return {
        ...state,
        user: null, // Reset user state to null
        isFetching: false,
        error: false,
      };
    case "SEARCH_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "SEARCH_SUCCESS":
      return {
        ...state,
        isFetching: false,
        SearchedUser: action.payload, // Only update SearchedUser
      };
    case "SEARCH_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: true,
      };
    case "RELOAD":
      return {
        ...state,
        reload: action.payload,
      };
    case "UNRELOAD":
      return {
        ...state,
        reload: action.payload,
      };

    case "SHOW_UPLOADPROFILEBOX":
      return {
        ...state,
        uploadProfileBox: true, // Set overlay to visible
      };
    case "HIDE_UPLOADPROFILEBOX":
      return {
        ...state,
        uploadProfileBox: false, // Hide the overlay
      };

    case "SHOW_COMMENTSBOX":
      return {
        ...state,
        commentBox: true, // Set overlay to visible
      };
    case "HIDE_COMMENTSBOX":
      return {
        ...state,
        commentBox: false, // Hide the overlay
      };
    case "YOUR_NEW_MESSAGE":
      return {
        ...state,
        yourNewMessage: action.payload, 
      };

    case "YOUR_NEW_COMMENT":
      return {
        ...state,
        yourNewMessage: action.payload, 
      };

    case "YOUR_NEW_POST":
      return {
        ...state,
        yourNewMessage: action.payload, 
      };

    default:
      return state;
  }
};

export default AuthReducer;

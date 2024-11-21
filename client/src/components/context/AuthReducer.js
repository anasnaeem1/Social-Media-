const AuthReducer = (state, action) => {
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
            isFetching: false,  // Stop fetching if login fails
            error: action.payload,  // Store the error message in the state
          };
      
    default:
      return state;
  }
};

export default AuthReducer

import axios from "axios";

export const loginCall = async (userCredentials, dispatch) => {
  const PA = import.meta.env.VITE_PUBLIC_API;
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post(`${PA}/api/auth/login`, userCredentials);
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  } catch (error) {
    dispatch({ type: "LOGIN_FAILURE", payload: error });
  }
};

export const searchUser = async (Username, dispatch) => {
  //   const PA = import.meta.env.VITE_PUBLIC_API;
  dispatch({ type: "SEARCH_START" });
  try {
    // const url = `${PA}api/users/?username=${username}`;
    // console.log("Constructed API URL:", url);
    const res = await axios.get(
      `http://localhost:8801/api/users/?username=${Username}`
    );
    const { profilePic, username, _id, bio } = res.data;
    dispatch({
      type: "SEARCH_SUCCESS",
      //   payload: res.data,
      payload: [{ profilePic: profilePic, username: username, id: _id }],
    });
  } catch (error) {
    dispatch({ type: "SEARCH_FAILURE", payload: error });
  }
};

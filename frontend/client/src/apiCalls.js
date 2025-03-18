import axios from "axios";
import { useContext } from "react";
import { UserContext } from "./components/context/UserContext";

export const loginCall = async (userCredentials, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post(`/api/auth/login`, userCredentials);
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  } catch (error) {
    dispatch({ type: "LOGIN_FAILURE", payload: error });
  }
};

export const updateUser = async (updatedUser, currentUser, dispatch) => {
  console.log("working");
  const changes = Object.fromEntries(
    Object.entries(updatedUser).filter(
      ([key, value]) => currentUser[key] !== value
    )
  );

  console.log(changes);

  if (Object.keys(changes).length === 0) {
    console.log("No changes detected");
    return;
  }
  try {
    dispatch({ type: "UPDATE_USER", payload: changes });
    console.log(changes);
    return console.log("Done");
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

export const searchUser = async (Username, dispatch) => {
  //   const PA = import.meta.env.VITE_PUBLIC_API;
  dispatch({ type: "SEARCH_START" });
  try {
    // const url = `api/users/?username=${username}`;
    // console.log("Constructed API URL:", url);
    const res = await axios.get(`/api/users/?username=${Username}`);
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

export const submittingPost = async (userId, desc, img, dispatch) => {
  try {
    let newPost;
    if (img) {
      newPost = {
        userId: userId,
        desc: desc,
        img: img,
      };
    } else {
      newPost = {
        userId: userId,
        desc: desc,
      };
    }

    const postResponse = await axios.post(`/api/posts/`, newPost);
    if (postResponse.data) {
      dispatch({
        type: "YOURNEWPOST",
        payload: postResponse.data,
      });
    }
    return postResponse.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getComments = async (postId) => {
  try {
    const commentsRes = await axios.get(`/api/comments/${postId}`);
    return commentsRes.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const uploadPhoto = async (commentPicture) => {
  try {
    const data = new FormData();
    data.append("file", commentPicture);

    const uploadResponse = await axios.post("/api/uploads", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return uploadResponse.data.url;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// export const submittingComment = async (userId, postId, text) => {
//   const PA = import.meta.env.VITE_PUBLIC_API;
//   const newComment = {
//     userId: userId,
//     postId: postId,
//     text: text,
//   };
//   try {
//     const commentRespose = await axios.post(`/api/comments`, newComment);
//     return commentRespose.data;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

export const getUser = async (userId, username) => {
  try {
    if (userId) {
      const res = await axios.get(`/api/users?userId=${userId}`);
      return res.data;
    } else if (username) {
      const res = await axios.get(`/api/users?username=${username}`);
      return res.data;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllUsers = async (userId) => {
  try {
    const allUsersRes = await axios.get(`/api/users/allUsers/${userId}`);
    return allUsersRes.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const isUserFollowed = (currentUser, profileUser) => {
  try {
    const normalizedFollowings = currentUser.followings.map((id) =>
      id.toString()
    );
    const isFollowed = normalizedFollowings.includes(
      profileUser._id.toString()
    );
    return isFollowed;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const calculateAge = (dob) => {
  // Check if dob is valid
  if (!dob || typeof dob !== "string") {
    throw new Error("Invalid date of birth (dob) provided");
  }

  const [day, month, year] = dob.split("/").map(Number);

  if (
    isNaN(day) ||
    isNaN(month) ||
    isNaN(year) ||
    day < 1 ||
    day > 31 ||
    month < 1 ||
    month > 12 ||
    year < 1900 ||
    year > new Date().getFullYear()
  ) {
    throw new Error("Invalid date of birth (dob) values");
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed
  const currentDay = currentDate.getDate();

  let age = currentYear - year;

  if (currentMonth < month || (currentMonth === month && currentDay < day)) {
    age--;
  }

  return age;
};

export const followUser = async (
  dispatch,
  currentUser,
  profileUser,
  followed
) => {
  try {
    if (followed) {
      const res = await axios.put(`/api/users/${profileUser._id}/unfollow`, {
        userId: currentUser._id,
      });
      if (res.data) {
        dispatch({ type: "UNFOLLOW", payload: profileUser._id });
      }
    } else {
      const res = await axios.put(`/api/users/${profileUser._id}/follow`, {
        userId: currentUser._id,
      });
      if (res.data) {
        dispatch({ type: "FOLLOW", payload: profileUser._id });
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserFriends = async (userId) => {
  try {
    if (userId) {
      const res = await axios.get(`/api/users/friends/${userId}`);
      return res.data;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getPostWithPostUser = async (postId) => {
  try {
    // Fetch the post
    if (postId) {
      const postRes = await axios.get(`/api/posts/getPost/${postId}`);
      // console.log("Post Response:", postRes.data); // Debugging

      if (!postRes.data) {
        throw new Error("Post not found");
      }

      // Fetch the post user
      const postUser = await getUser(postRes.data.userId, 0);
      // console.log("Post User:", postUser); // Debugging

      if (!postUser) {
        throw new Error("User not found");
      }

      // Return the combined data
      return { post: postRes.data, postUser };
    }
  } catch (error) {
    console.error("Error in getPostWithPostUser:", error);
    throw error; // Re-throw the error for the caller to handle
  }
};

export const getBirthdayFriends = async (userId) => {
  try {
    const res = await axios.get(`/api/users/birthdayFriends/${userId}`);
    if (res.data) return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deletePost = async (postId, userId) => {
  try {
    if (!postId || !userId) throw new Error("postId and userId are required");

    const res = await axios.delete(
      `/api/posts/deletePost/${postId}?userId=${userId}` // ✅ Send userId as query param
    );

    return res.data.deletedPost;
  } catch (error) {
    console.error(
      "Error deleting post:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deletePhoto = async (photoURL) => {
  try {
    if (!photoURL) throw new Error("postId and userId are required");
    const res = await axios.delete(`/api/delete?url=${photoURL}`);
    return res.data;
  } catch (error) {
    console.error(
      "Error deleting post:",
      error.response?.data || error.message
    );
    throw error;
  }
};

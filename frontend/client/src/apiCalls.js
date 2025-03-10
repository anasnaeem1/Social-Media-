import axios from "axios";

const PA = import.meta.env.VITE_PUBLIC_API;
export const loginCall = async (userCredentials, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post(`/api/auth/login`, userCredentials);
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  } catch (error) {
    dispatch({ type: "LOGIN_FAILURE", payload: error });
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

export const getUserFriends = async (userId) => {
  try {
    if (userId) {
      const res = await axios.get(`/api/users/friends/${userId}`)
      return res.data;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

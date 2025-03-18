import React, { useContext, useEffect, useState } from "react";
import UserPhoto from "../../../userPhoto";
import { UserContext } from "../../../context/UserContext";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import PostButton from "../feed/post/postButton";
import axios from "axios";
import {
  deletePhoto,
  deletePost,
  getPostWithPostUser,
} from "../../../../apiCalls";
import { format } from "timeago.js";
import CommentBox from "../feed/post/comments/commentBox";
import CommentSumbitForm from "../feed/post/comments/commentSubmitForm";

function floatingBox({ height, width }) {
  const location = useLocation();
  const { dispatch, floatingBox, user } = useContext(UserContext);
  const [endingAnimation, setEndingAnimation] = useState(false);

  const handleBackToHome = (e) => {
    e.preventDefault();

    setEndingAnimation(true);

    dispatch({
      type: "TOGGLEFLOATINGBOX",
      payload: { disable: true, purpose: "", details: {} },
    });
  };

  const handleCallToActionButton = async (e) => {
    e.preventDefault();

    if (
      floatingBox.purpose === "deletePost" &&
      floatingBox.details._id &&
      user?._id
    ) {
      try {
        const post = floatingBox.details;
        if (post.img) {
          const deletePhotoRes = await deletePhoto(post?.img);
        }
        const deletePostRes = await deletePost(post?._id, user._id);
        dispatch({
          type: "TOGGLEFLOATINGBOX",
          payload: {
            disable: true,
            purpose: "postDeleted",
            details: {},
            result: deletePostRes,
          },
        });
      } catch (error) {
        console.error("Failed to delete post:", error);

        dispatch({
          type: "TOGGLEFLOATINGBOX",
          payload: {
            disable: true,
            purpose: "deletePost",
            details: {},
            result: null, // No result due to failure
          },
        });
      }
    }
  };

  return (
    <>
      {/* Light Overlay */}
      <div className="fixed inset-0  bg-black bg-opacity-40 z-40"></div>

      {/* Centered Confirmation Box */}
      <div
        className="fixed transition-all w-full max-w-lg duration-300 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl z-50 shadow-3xl border border-gray-300 p-6"
        style={{
          width: "100%",
          maxWidth: "450px",
          height: height || "auto",
        }}
      >
        {/* Confirmation Content */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Delete post?</h2>
          <p className="text-gray-700 mt-3">
            Are you sure you want to delete this post?
          </p>

          {/* Buttons */}
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={handleBackToHome}
              className="px-10 py-2 bg-gray-300 text-gray-800 rounded-lg transition-all hover:bg-gray-400 hover:shadow-md active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleCallToActionButton}
              className="px-10 py-2 bg-red-600 text-white rounded-lg transition-all hover:bg-red-700 hover:shadow-md active:scale-95"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default floatingBox;

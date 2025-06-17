import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../../../../context/UserContext";
import { getComments, uploadPhoto } from "../../../../../../apiCalls";
import Comment from "./Comment"; // Make sure Comment is imported properly

function commentSubmitForm({ ViewPhoto, isPostPage, post }) {
  const { dispatch, user } = useContext(UserContext);
  const [commentPicture, setCommentPicture] = useState(null);
  const [commentPicPreview, setCommentPicPreview] = useState(null);
  const commentText = useRef();

  const handleCommentFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCommentPicture(file);
      const previewURL = URL.createObjectURL(file);
      setCommentPicPreview(previewURL);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.current.value.trim()) {
      commentText.current.border;
      return;
    }

    try {
      let uniqueFileName = null;

      if (commentPicture) {
        uniqueFileName = await uploadPhoto(commentPicture);
        console.log("Received unique filename:", uniqueFileName);
      }

      const newComment = {
        userId: user?._id,
        postId: post?._id,
        text: commentText.current.value,
        img: uniqueFileName || undefined,
      };

      const commentResponse = await axios.post(`/api/comments`, newComment);
      commentText.current.value = "";

      console.log(commentResponse.data);
      if (commentResponse.data) {
        dispatch({
          type: "YOURNEWCOMMENT",
          payload: commentResponse.data,
        });
        setCommentPicture(null);
      }
    } catch (error) {
      console.error(
        "Failed to post comment:",
        error.response?.data || error.message || error
      );
    }
  };

  return (
    <form
      className={`
      ${
        ViewPhoto ? "absolute" : "fixed"
      } bottom-0 left-0 gap-2 w-full p-2 border-t bg-white rounded-lg shadow-sm`}
      onSubmit={handleCommentSubmit}
    >
      {/* Image Preview Section */}
      {commentPicture && (
        <div className="flex items-center gap-2">
          <img
            src={commentPicPreview}
            alt="Selected preview"
            className="w-[90px] h-[90px] rounded-md object-cover border"
          />
          <button
            type="button"
            className="text-red-500 text-xs"
            onClick={() => setCommentPicture(null)}
          >
            Remove
          </button>
        </div>
      )}

      <div
        className={`flex flex-col sm:flex-row items-stretch gap-2 w-full border `}
      >
        {/* Image Icon for Upload */}
        <div className="flex gap-2 w-full">
        <label
          htmlFor="file-upload"
          className="text-gray-500 hover:text-blue-600 transition duration-150 flex-shrink-0 cursor-pointer flex items-center justify-center w-10 h-10 border border-gray-300 rounded-md"
          title="Add Photo"
        >
          <i className="ri-image-ai-fill text-xl"></i>
        </label>

        {/* File Input (Hidden by Default) */}
        <input
          type="file"
          id="file-upload"
          accept=".png, .jpg, .jpeg"
          className="hidden"
          onChange={handleCommentFileChange}
        />

        {/* Textarea for Comment Input */}
        <textarea
          id="comment-input"
          placeholder="Write a comment..."
          rows={1}
          maxLength={300}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none text-sm text-gray-700 resize-none overflow-hidden"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (e.target.value.trim()) {
                handleCommentSubmit(e);
              }
            }
          }}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = `${Math.min(e.target.scrollHeight, 60)}px`;
          }}
          ref={commentText}
        ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full sm:w-auto px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 text-sm flex-shrink-0"
        >
          Post
        </button>
      </div>
    </form>
  );
}
export default commentSubmitForm;

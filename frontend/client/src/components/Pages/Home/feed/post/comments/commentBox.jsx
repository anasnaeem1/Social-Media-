import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../../../../context/UserContext";
import Comment from "./Comment"; // Make sure Comment is imported properly

function CommentBox({ post, postUser, userId }) {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const PA = import.meta.env.VITE_PUBLIC_API;
  const { dispatch, user } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState(false);
  const [commentPicture, setCommentPicture] = useState(null); // State for the uploaded picture
  const [commentPicPreview, setCommentPicPreview] = useState(null); // State for the uploaded picture
  const commentText = useRef();

  const { postId } = useParams();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (postId) {
          const commentsRes = await axios.get(`${PA}/api/comments/${postId}`);
          if (commentsRes.data) {
            setComments(commentsRes.data);
          }
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [post._id, postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
  
    if (!commentText.current.value.trim()) {
      console.error("Comment text is required.");
      return;
    }
  
    let uniqueFileName = null;
  
    // Upload the file if present
    if (commentPicture) {
      try {
        const data = new FormData();
        data.append("file", commentPicture);
  
        const uploadResponse = await axios.post(
          "https://social-media-backend-eight-azure.vercel.app/api/uploads",
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
  
        uniqueFileName = uploadResponse.data;
        console.log("Received unique filename:", uniqueFileName);
      } catch (error) {
        console.error("File upload failed:", error.response?.data || error.message || error);
        return;
      }
    }
  
    // Construct the comment object
    const newComment = {
      userId: user._id,
      postId: post._id,
      text: commentText.current.value,
    };
  
    if (uniqueFileName) {
      newComment.img = uniqueFileName;
    }
  
    // Post the comment
    try {
      const commentResponse = await axios.post(
        `${PA}/api/comments`,
        newComment
      );
      commentText.current.value = "";
  
      if (commentResponse.data) {
        setNewComment(true);
        setComments((prevComments) => [
          commentResponse.data,
          ...prevComments,
        ]);
        setCommentPicture(null);
  
        const commentsContainer = document.getElementById("comments-container");
        const lastComment = commentsContainer?.lastElementChild;
  
        if (lastComment) {
          lastComment.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    } catch (error) {
      console.error(
        "Failed to post comment:",
        error.response?.data || error.message || error
      );
    }
  };
  

  const handleCommentFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setCommentPicture(file); // Set the selected file in the state
      const previewURL = URL.createObjectURL(file);
      setCommentPicPreview(previewURL)
    }
  };

  return (
    <>
      {/* Comments Section */}
      <div
  id="comment-box"
  className="flex flex-col px-4 py-3 border-t border-gray-300"
>
  <div className="flex justify-between items-center mb-3">
    <h2 className="text-base font-semibold text-gray-800">Comments</h2>
    <button className="text-sm text-blue-600 hover:underline">
      Filter Comments
    </button>
  </div>

  {/* Comments List */}
  <div
    className="flex flex-col gap-3 max-h-[280px] overflow-y-auto overflow-x-hidden pr-2"
    style={{
      scrollbarWidth: "thin",
      scrollbarColor: "lightgray transparent",
    }}
  >
    {postId && comments?.length > 0 ? (
      comments.map((comment) => (
        <Comment
          userId={userId}
          postId={postId}
          postUser={postUser}
          newComment={newComment}
          key={comment._id}
          comment={comment}
        />
      ))
    ) : (
      <p className="text-sm text-gray-500">No comments yet.</p>
    )}
  </div>

  {/* Add Comment Input */}
  <form
    className="flex flex-col gap-2 p-2 border-t rounded-lg shadow-sm"
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
          onClick={() => setCommentPicture(null)} // Remove the preview
        >
          Remove
        </button>
      </div>
    )}

    {/* Add Comment Input Section */}
    <div className="flex items-center gap-2">
      {/* Image Icon for Upload */}
      <label
        htmlFor="file-upload"
        className="text-gray-500 hover:text-blue-600 transition duration-150 flex-shrink-0 cursor-pointer"
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
        onChange={handleCommentFileChange} // Handle file selection
      />

      {/* Textarea for Comment Input */}
      <textarea
        id="comment-input"
        placeholder="Write a comment... (Shift+Enter for new line)"
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
          e.target.style.height = `${Math.min(
            e.target.scrollHeight,
            60
          )}px`;
        }}
        ref={commentText}
      ></textarea>

      {/* Submit Button */}
      <button
        type="submit"
        className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 text-sm flex-shrink-0"
      >
        Post
      </button>
    </div>
  </form>
</div>

    </>
  );
}

export default CommentBox;

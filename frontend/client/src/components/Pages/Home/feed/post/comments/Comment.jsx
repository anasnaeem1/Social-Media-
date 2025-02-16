import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import UserPhoto from "../../../../../userPhoto";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { UserContext } from "../../../../../context/UserContext";
import Reply from "../comments/reply";
import { getFormControlUtilityClasses } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getUser, uploadPhoto } from "../../../../../../apiCalls";

function Comment({ userId, postId, viewPhoto, postUser, comment, newComment }) {
  const navigate = useNavigate();
  const [commentUser, setCommentUser] = useState(null);
  const { user } = useContext(UserContext);
  const [userFetching, setUserFetching] = useState(true);
  const [likingComment, setLikingComment] = useState(false);
  const [likes, setLikes] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [replies, setReplies] = useState([]);
  const [repliesVisibility, setRepliesVisibility] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(newComment);
  const [replyPicture, setReplyPicture] = useState(null);
  const [replyPicPreview, setReplyPicPreview] = useState(null);
  const [newReply, setNewReply] = useState(false);
  // const { userId } = useParams();

  const replyText = useRef();

  console.log("userId in comment component is", userId);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (comment?.userId) {
          setUserFetching(true);
          const user = await getUser(comment?.userId, 0);
          setCommentUser(user);
          setUserFetching(false);
        }
      } catch (error) {
        console.log("Error fetching user", error);
      }
    };
    fetchUser();
  }, [comment?.userId, comment]);

  useEffect(() => {
    if (Array.isArray(comment.likes)) {
      setIsLiked(comment.likes.includes(user._id));
      setLikes(comment.likes.length);
    }
  }, [comment.likes, user._id]);

  // Highlight effect timeout for new comments
  useEffect(() => {
    if (isHighlighted) {
      const timeout = setTimeout(() => {
        setIsHighlighted(false);
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [isHighlighted]);

  const handleCommentLike = async (e) => {
    e.preventDefault();
    if (likingComment) return;

    setLikingComment(true);
    const userId = user._id;

    try {
      await axios.put(`/api/comments/${comment._id}/likeComment`, {
        userId: userId,
      });

      setLikes(isLiked ? likes - 1 : likes + 1);
      setIsLiked(!isLiked);
    } catch (error) {
      console.log(error);
    } finally {
      setLikingComment(false);
    }
  };

  const handleReplies = async (e) => {
    e.preventDefault();

    try {
      const repliesRes = await axios.get(`/api/commentsReplies/${comment._id}`);
      if (repliesRes.data) {
        setReplies(repliesRes.data);
        setRepliesVisibility(!repliesVisibility);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReplyImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReplyPicture(file);
      const previewURL = URL.createObjectURL(file);
      setReplyPicPreview(previewURL);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    try {
      let uniqueFileName = null;

      if (replyPicture) {
        uniqueFileName = await uploadPhoto(replyPicture);
        console.log("Received unique filename:", uniqueFileName);
      }

      if ((user._id, comment._id, replyText.current.value)) {
        const newReply = {
          userId: user._id,
          commentId: comment._id,
          text: replyText.current.value,
          img: uniqueFileName || undefined,
        };

        try {
          const commentRespose = await axios.post(
            `/api/commentsReplies`,
            newReply
          );
          replyText.current.value = "";
          if (commentRespose.data) {
            console.log(commentRespose.data);
            setNewReply(true);
            setReplies((prevReplies) => [...prevReplies, commentRespose.data]);
          }
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
    } catch (error) {
      console.error(
        "An error occurred:",
        error.response?.data || error.message || error
      );
    }
  };

  const handleRemoveReplyPic = () => {
    setReplyPicPreview(null);
    setReplyPicture(null);
  };

  return (
    <div
      className={`px-2 py-4 border-t border-gray-200 transition-all duration-500 ${
        isHighlighted ? "bg-green-100 scale-105" : "bg-white"
      }`}
    >
      {userFetching ? (
        <div className="flex items-center gap-4">
          <Skeleton circle width={40} height={40} />
          <div className="flex-1">
            <Skeleton width="50%" height={20} />
            <Skeleton width="90%" height={16} style={{ marginTop: 8 }} />
          </div>
        </div>
      ) : (
        <div>
          <div
            className={`flex items-start gap-4 px-2 rounded-lg ${
              comment.userId === postUser._id
                ? "border-l-4 border-blue-400"
                : ""
            }`}
          >
            <div className="overflow-hidden">
              <UserPhoto userId={commentUser._id} user={commentUser} />
            </div>
            <div className="flex-1">
              <div className={`flex justify-between items-center`}>
                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  {commentUser?.fullname || "Anonymous User"}
                  {comment.userId === postUser._id && (
                    <i
                      className="ri-shield-user-line text-blue-400"
                      title="Admin"
                    ></i>
                  )}
                </h3>
              </div>

              <p className="text-sm text-gray-700 my-1">
                {comment.text || "No comment text provided."}
              </p>
              <Link to={`/photo/${comment.img}`} className="flex justify-start">
                {comment.img && (
                  <div className="cursor-pointer border relative w-full max-w-[500px] max-h-[300px] rounded-xl overflow-hidden">
                    <img
                      src={`${comment.img}`}
                      alt="Comment"
                      className="w-full h-auto object-contain rounded-xl"
                    />
                  </div>
                )}
              </Link>
              <div className="flex items-center gap-4 mt-2">
                <span
                  onClick={handleCommentLike}
                  className={`${
                    isLiked ? "text-red-600" : "text-blue-600"
                  } cursor-pointer text-sm font-medium hover:underline`}
                >
                  Like
                </span>

                <button
                  onClick={handleReplies}
                  className="cursor-pointer text-blue-600 text-sm font-medium hover:underline"
                >
                  Reply
                </button>
                {likes > 0 && (
                  <span className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">{likes}</span>{" "}
                    {likes === 1 ? "like" : "likes"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Replies Section */}
          {repliesVisibility && (
            <div className="mt-4 ml-8 border-gray-200 bg-gray-50 p-4 rounded-md">
              {/* Render Replies */}
              {replies.length > 0 ? (
                replies.map((reply) => (
                  <div key={reply._id}>
                    <Reply viewPhoto={viewPhoto} reply={reply} newReply={newReply} />
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No replies yet.</p>
              )}

              {/* Input for Adding a Reply */}
              <form
                onSubmit={handleReplySubmit}
                className="mt-4 flex flex-col gap-3"
              >
                {replyPicture && replyPicPreview && (
                  <div className="flex items-center gap-3">
                    <img
                      src={replyPicPreview}
                      alt="Selected preview"
                      className="w-[90px] h-[90px] rounded-md object-cover border"
                    />
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-600 text-xs"
                      onClick={handleRemoveReplyPic}
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Reply Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    ref={replyText}
                    placeholder="Write a reply..."
                    className="flex-1 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />

                  {/* Image Upload Icon */}
                  <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 p-2 rounded-md">
                    <i className="ri-image-add-line text-xl text-gray-600"></i>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleReplyImageChange}
                    />
                  </label>

                  {/* Reply Button */}
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600"
                  >
                    Reply
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Comment;

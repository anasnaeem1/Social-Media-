import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import UserPhoto from "../../../../../userPhoto";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { UserContext } from "../../../../../context/UserContext";
import Reply from "../comments/reply";
import { getFormControlUtilityClasses } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";

function Comment({ userId, postId, postUser, comment, newComment }) {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const PA = import.meta.env.VITE_PUBLIC_API;
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
  const [newReply, setNewReply] = useState(false);
  // const { userId } = useParams();

  const replyText = useRef();

  console.log("userId in comment component is", userId);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (comment?.userId) {
          setUserFetching(true);
          const res = await axios.get(
            `/api/users?userId=${comment.userId}`
          );
          setCommentUser(res.data);
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
      }, 400); // Highlight lasts for 3 seconds
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
      const repliesRes = await axios.get(
        `/api/commentsReplies/${comment._id}`
      );
      if (repliesRes.data) {
        setReplies(repliesRes.data);
        setRepliesVisibility(!repliesVisibility);

        // Conditional navigation based on the presence of userId
        if (!userId) {
          navigate(`/${postId}/${comment._id}`);
        } else {
          navigate(`/profile/${userId}/${postId}/${comment._id}`);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    // if (!commentFile) {
    //   console.error("No file selected.");
    //   return;
    // }
    // console.log("File to be uploaded:", postFile);

    try {
      // const data = new FormData();
      // data.append("file", postFile);

      // const uploadResponse = await axios.post(
      //   "http://localhost:8801/api/uploads",
      //   data,
      //   {
      //     headers: { "Content-Type": "multipart/form-data" },
      //   }
      // );
      // const uniqueFileName = uploadResponse.data;
      // console.log("Received unique filename:", uniqueFileName);

      if ((user._id, comment._id, replyText.current.value)) {
        const newReply = {
          userId: user._id,
          commentId: comment._id,
          text: replyText.current.value,
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
        // dispatch({
        //   type: "YOUR_NEW_COMMENT",
        //   payload: {
        //     userId: user._id,
        //     postId: user._id,
        //     text: commentText.current.value
        //   },
        // });
      }
    } catch (error) {
      console.error(
        "An error occurred:",
        error.response?.data || error.message || error
      );
    }
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
                  {commentUser?.username || "Anonymous User"}
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
                  <div className="cursor-pointer border relative w-full h-[170px] rounded-xl overflow-hidden">
                    <img
                      src={`${PF}${comment.img}`}
                      alt="Comment"
                      className="w-full h-full object-contain rounded-xl"
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
            <div className="mt-4 ml-8 border-gray-200 bg-gray-50">
              {/* Render Replies */}
              {replies.length > 0 ? (
                replies.map((reply) => (
                  <div key={reply._id}>
                    <Reply reply={reply} newReply={newReply} />
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No replies yet.</p>
              )}

              {/* Input for Adding a Reply */}
              <form
                onSubmit={handleCommentSubmit}
                className="mt-4 flex items-center gap-2"
              >
                <input
                  type="text"
                  ref={replyText}
                  // onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600"
                >
                  Reply
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Comment;

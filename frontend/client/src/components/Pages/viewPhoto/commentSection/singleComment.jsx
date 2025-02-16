import { useContext, useEffect, useState } from "react";
import { format } from "timeago.js";
import {
  RiThumbUpLine,
  RiMore2Line,
  RiThumbUpFill,
  RiReplyLine,
} from "react-icons/ri";
import UserPhoto from "../../../userPhoto";
import axios from "axios";
import { UserContext } from "../../../context/UserContext";
import ReplySection from "./replySection/replySection";
import { getUser } from "../../../../apiCalls";
import Reply from "../../Home/feed/post/comments/reply";

function singleComment({ comment }) {
  const [replies, setReplies] = useState([]);
  const [repliesVisibility, setRepliesVisibility] = useState(false);
  const [commentUser, setCommentUser] = useState(null);
  const { dispatch, user } = useContext(UserContext);
  const [userFetching, setUserFetching] = useState(true);
  const [likes, setLikes] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likingComment, setLikingComment] = useState(false);
  const [replyPicture, setReplyPicture] = useState(null);
  const [replyPicPreview, setReplyPicPreview] = useState(null);
  const [newReply, setNewReply] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (comment?.userId) {
          setUserFetching(true);
          const user = await getUser(comment?.userId, 0);
          setCommentUser(user);
          // console.log(res.data);
          setUserFetching(false);
        }
      } catch (error) {
        console.log("Error fetching user", error);
      }
    };
    fetchUser();
  }, [comment?.userId, comment]);

  useEffect(() => {
    if (Array.isArray(comment?.likes)) {
      setIsLiked(comment?.likes.includes(user?._id));
      setLikes(comment?.likes.length);
    }
  }, [comment?.likes, user._id]);

  // Liking a comment
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

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const repliesRes = await axios.get(
          `/api/commentsReplies/${comment?._id}`
        );
        if (repliesRes.data) {
          setReplies(repliesRes.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchReplies();
  }, [comment?.userId, comment]);

  const handleRepliesVisibility = (e) => {
    e.preventDefault();
    setRepliesVisibility(!repliesVisibility);
  };

  const handleReplyImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReplyPicture(file);
      const previewURL = URL.createObjectURL(file);
      setReplyPicPreview(previewURL);
    }
  };

  const handleRemoveReplyPic = (e) => {
    if (replyPicture && replyPicPreview) {
      setReplyPicture(null);
      setReplyPicPreview(null);
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

  return (
    commentUser && (
      <div className="px-3 py-6 border-b border-gray-200">
        <div className="flex items-start gap-3">
          <UserPhoto userId={comment?.userId} user={commentUser} />
          <div className="flex-1">
            {/* Comment Header */}
            <div className="flex items-center justify-between">
              <p className="text-gray-800 font-semibold">
                {commentUser?.fullname}
              </p>
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <p>{format(comment.createdAt)}</p>
                <RiMore2Line className="cursor-pointer hover:text-gray-800" />
              </div>
            </div>
            {/* Comment Text */}
            <p className="text-gray-700 mt-1">{comment.text}</p>
            {/* Comment Image (if available) */}
            {comment.img && (
              <div className="cursor-pointer border relative w-full max-w-[500px] max-h-[300px] rounded-xl overflow-hidden mt-2">
                <img
                  src={comment.img}
                  alt="Comment"
                  className="w-full h-auto object-contain rounded-xl"
                />
              </div>
            )}
            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-3 text-gray-600 text-sm">
              <div className="flex gap-2">
                {/* Like Button */}
                <button
                  onClick={handleCommentLike}
                  className={`flex items-center text-md gap-1 hover:text-blue-500 transition ${
                    isLiked ? "text-blue-500" : "text-gray-600"
                  }`}
                >
                  {isLiked ? <RiThumbUpFill /> : <RiThumbUpLine />}
                </button>
                <p>{likes > 0 ? likes : ""}</p>
              </div>

              {/* Reply Button */}
              <button
                onClick={handleRepliesVisibility}
                className="flex items-center gap-1 hover:text-blue-500 transition"
              >
                <RiReplyLine /> Reply
              </button>
            </div>
            {/* View More Replies */}
            {Array.isArray(replies) && replies?.length > 0 && (
              <button
                onClick={handleRepliesVisibility}
                className="mt-2 text-sm text-gray-500 hover:text-blue-500 transition"
              >
                View more replies ({replies?.length}){/* Dummy count */}
              </button>
            )}
          </div>
        </div>
        <div className="w-full ml-5">
          <div className="w-full ml-5">
            {repliesVisibility && (
              <>
                <div>
                  <ReplySection newReply={newReply} replies={replies} commentUser={commentUser} />
                </div>

                {/* Reply Input */}
                <div className="border-l-2 border-blue-300">
                  <div className="bg-white w-full border-t border-gray-300 p-3 flex flex-col gap-2">
                    <form
                      onSubmit={handleReplySubmit}
                      className="flex flex-col gap-3 w-full"
                    >
                      {/* Image Preview (If Selected) */}
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

                      {/* Text Area & Actions */}
                      <div className="flex items-center gap-2 w-full">
                        {/* Text Area */}
                        <textarea
                          style={{ scrollbarWidth: "none" }}
                          id="reply-input"
                          placeholder={`Reply to ${
                            commentUser?.fullname?.split(" ")[0]
                          }...`}
                          rows={1}
                          maxLength={300}
                          className="w-full border border-gray-300 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        ></textarea>

                        {/* Image Upload */}
                        <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 p-2 rounded-md">
                          <i className="ri-image-add-line text-xl text-gray-600"></i>
                          <input
                            onChange={handleReplyImageChange}
                            type="file"
                            className="hidden"
                          />
                        </label>

                        {/* Post Button */}
                        <button
                          type="submit"
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                        >
                          Reply
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  );
}
export default singleComment;

import { useContext, useEffect, useState } from "react";
import UserPhoto from "../../../../userPhoto";
import axios from "axios";
import { UserContext } from "../../../../context/UserContext";
import { format } from "timeago.js";

function Reply({ reply, newReply, viewPhoto }) {
  const [replyUser, setReplyUser] = useState(null);
  const [userFetching, setUserFetching] = useState(false);
  const { user } = useContext(UserContext);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [likingReply, setLikingReply] = useState(false);
  const [likes, setLikes] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!Array.isArray(reply?.likes)) return;
    setIsLiked(reply.likes.includes(user._id));
    setLikes(reply.likes.length);
  }, [reply?.likes, user._id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (reply?.userId) {
          setUserFetching(true);
          const res = await axios.get(`/api/users?userId=${reply.userId}`);
          setReplyUser(res.data);
        }
      } catch (error) {
        console.warn("reply user:", error.message);
      } finally {
        setUserFetching(false);
      }
    };
    fetchUser();
  }, [reply?.userId]);

  /** Parent marks one reply briefly (matches `_id`). */
  useEffect(() => {
    if (!newReply) return;
    setIsHighlighted(true);
    const t = setTimeout(() => setIsHighlighted(false), 900);
    return () => clearTimeout(t);
  }, [newReply, reply?._id]);

  const handleCommentLike = async (e) => {
    e.preventDefault();
    if (likingReply) return;

    setLikingReply(true);
    const userId = user._id;

    try {
      await axios.put(`/api/commentsReplies/${reply._id}/likeCommentReply`, {
        userId,
      });

      setLikes(isLiked ? likes - 1 : likes + 1);
      setIsLiked(!isLiked);
    } catch (error) {
      console.warn(error.message);
    } finally {
      setLikingReply(false);
    }
  };

  return (
    <>
      {userFetching ? (
        <div
          className={`flex animate-pulse items-start gap-3 px-3 py-3 sm:gap-4 sm:px-4 ${
            viewPhoto ? "bg-white" : "border-b border-gray-100 px-4 py-2"
          }`}
        >
          <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 w-1/3 max-w-[8rem] rounded bg-gray-200" />
            <div className="h-3 w-2/3 max-w-[12rem] rounded bg-gray-200" />
          </div>
        </div>
      ) :
        replyUser ?
          <div
            className={`flex w-full min-w-0 flex-col gap-3 transition-colors duration-500 sm:flex-row sm:items-start sm:gap-4 ${
              viewPhoto ?
                `px-3 py-4 sm:px-4 ${
                  isHighlighted ?
                    "bg-emerald-50/90 ring-1 ring-inset ring-emerald-100"
                  : "bg-white"
                }`
              : `border-b border-gray-100 py-3 pl-4 sm:pl-9 pr-3 ${
                  isHighlighted ? "bg-emerald-50/80" : "bg-white"
                }`
            }`}
          >
            <div className="overflow-hidden shrink-0">
              <UserPhoto userId={replyUser._id} user={replyUser} />
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                <h4 className="text-sm font-semibold text-gray-900">
                  {replyUser?.fullname?.split(" ")[0] || "User"}
                </h4>
                <span className="text-[11px] leading-none text-gray-500 sm:hidden">
                  {reply.createdAt ? format(reply.createdAt) : ""}
                </span>
              </div>

              <p className="break-words text-sm leading-relaxed text-gray-700">
                {reply.text}
              </p>

              {reply.img ?
                <div className="mt-2 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                  <img
                    src={reply.img}
                    alt=""
                    className="mx-auto block max-h-56 w-full max-w-[min(100%,440px)] object-contain"
                  />
                </div>
              : null}

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                <button
                  type="button"
                  onClick={handleCommentLike}
                  disabled={likingReply}
                  className={`min-h-[44px] px-1 text-sm font-medium hover:underline disabled:opacity-50 ${
                    isLiked ? "text-red-600" : "text-blue-600"
                  }`}
                >
                  Like
                </button>

                <span className="min-h-[44px] px-1 text-sm font-medium leading-[44px] text-blue-600 opacity-75">
                  Reply
                </span>

                {likes > 0 ?
                  <span className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">{likes}</span>{" "}
                    {likes === 1 ? "like" : "likes"}
                  </span>
                : null}
              </div>
            </div>

            <span className="hidden shrink-0 self-start whitespace-nowrap pt-0.5 text-[12px] text-gray-500 sm:block">
              {reply.createdAt ? format(reply.createdAt) : ""}
            </span>
          </div>
        : null
      }
    </>
  );
}

export default Reply;

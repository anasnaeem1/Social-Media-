import { useContext, useEffect, useState } from "react";
import UserPhoto from "../../../../../userPhoto";
import axios from "axios";
import { UserContext } from "../../../../../context/UserContext";

function Reply({ reply, newReply, viewPhoto }) {
  const [replyUser, setReplyUser] = useState(null);
  const [userFetching, setUserFetching] = useState(false);
  const { user } = useContext(UserContext);
  const PF = import.meta.env.VITE_PUBLIC_FOLDER || "/images/";
  const PA = import.meta.env.VITE_PUBLIC_API;
  const [isHighlighted, setIsHighlighted] = useState(newReply);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (reply?.userId) {
          setUserFetching(true);
          const res = await axios.get(`/api/users?userId=${reply.userId}`);
          setReplyUser(res.data);
          setUserFetching(false);
        }
      } catch (error) {
        console.log("Error fetching user", error);
      }
    };
    fetchUser();
  }, [reply?.userId]);

  // Highlight effect timeout for new replies
  useEffect(() => {
    if (isHighlighted) {
      const timeout = setTimeout(() => {
        setIsHighlighted(false);
      }, 400); // Highlight lasts for 400ms
      return () => clearTimeout(timeout);
    }
  }, [isHighlighted]);

  return (
    <>
      {userFetching ? (
        <div className="flex items-start gap-4 px-4 py-2 border-b animate-pulse">
          {/* Skeleton for User Photo */}
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>

          {/* Skeleton for User Info */}
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      ) : (
        replyUser && (
          <div
            className={`${
              viewPhoto ? "p-2 bg-white" : "px-4 py-2"
            } flex items-start gap-4  border-b transition-all duration-500 ${
              isHighlighted ? "bg-green-100 scale-105" : "bg-white"
            }`}
          >
            {/* User Photo */}
            <div className="overflow-hidden">
              <UserPhoto userId={replyUser._id} user={replyUser} />
            </div>

            {/* Comment Content */}
            <div className="flex-1">
              {/* Username */}
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                {replyUser?.fullname?.split(" ")[0] || "Anonymous User"}
              </h4>

              {/* Comment Text */}
              <p className="text-sm text-gray-700 mt-1">{reply.text}</p>

              {/* Image Preview (if available) */}
              {reply.img && (
                <div className="mt-2">
                  <img
                    src={reply.img}
                    alt="Reply"
                    className="w-full max-w-[400px] h-auto rounded-lg border object-cover"
                  />
                </div>
              )}

              {/* Like & Reply Buttons */}
              <div className="flex items-center gap-4 mt-2">
                <span
                  // onClick={handleCommentLike}
                  className={` cursor-pointer text-sm font-medium hover:underline`}
                >
                  Like
                </span>
                {/* <span
                // onClick={handleCommentLike}
                className={`${
                  isLiked ? "text-red-600" : "text-blue-600"
                } cursor-pointer text-sm font-medium hover:underline`}
              >
                Like
              </span> */}

                <button
                  // onClick={handleReplies}
                  className="cursor-pointer text-blue-600 text-sm font-medium hover:underline"
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
}

export default Reply;

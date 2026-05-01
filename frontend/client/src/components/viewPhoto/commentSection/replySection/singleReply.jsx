import { format } from "timeago.js";
import UserPhoto from "../../../userPhoto";
import { getUser } from "../../../../apiCalls";
import { useEffect, useState } from "react";

/** Standalone reply row (optional reuse outside feed `Reply`). */
function SingleReply({ reply, newReply: shouldHighlight }) {
  const [replyUser, setReplyUser] = useState(null);
  const [userFetching, setUserFetching] = useState(true);
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    if (!shouldHighlight) return;
    setIsHighlighted(true);
    const t = setTimeout(() => setIsHighlighted(false), 900);
    return () => clearTimeout(t);
  }, [shouldHighlight, reply?._id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (reply?.userId) {
          setUserFetching(true);
          const u = await getUser(reply?.userId, 0);
          setReplyUser(u);
        }
      } catch (error) {
        console.warn("singleReply user:", error.message);
      } finally {
        setUserFetching(false);
      }
    };
    fetchUser();
  }, [reply?.userId, reply]);

  if (userFetching) {
    return (
      <div className="flex animate-pulse items-start gap-3 px-4 py-2 border-b border-gray-100">
        <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200" />
        <div className="min-w-0 flex-1 space-y-2 py-1">
          <div className="h-4 w-1/4 rounded bg-gray-200" />
          <div className="h-3 w-full max-w-[16rem] rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (!replyUser) return null;

  return (
    <div
      className={`flex items-start gap-3 border-b border-gray-100 px-3 py-3 transition-colors duration-300 sm:gap-4 sm:px-4 ${
        isHighlighted ? "bg-emerald-50/85" : "bg-white"
      }`}
    >
      <UserPhoto userId={reply.userId} user={replyUser} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <h4 className="text-sm font-semibold text-gray-900">
            {replyUser?.fullname ?? "Someone"}
          </h4>
          <span className="text-[11px] text-gray-500">
            {reply.createdAt ? format(reply.createdAt) : ""}
          </span>
        </div>
        <p className="mt-1 break-words text-sm text-gray-700">{reply.text}</p>
        {reply.img ?
          <div className="mt-2 overflow-hidden rounded-xl border border-gray-100">
            <img
              src={reply.img}
              alt=""
              className="max-h-52 w-full object-contain"
            />
          </div>
        : null}
      </div>
    </div>
  );
}

export default SingleReply;

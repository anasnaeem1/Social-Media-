import { useContext } from "react";
import UserPhoto from "../../userPhoto";
import { UserContext } from "../../context/UserContext";

function messgeBox({ senderId, user, msg, messageSent }) {
  const { user: currentUser } = useContext(UserContext);
  const userId = currentUser?._id;
  const isOwn = userId === senderId;

  const label = isOwn ? "You" : user?.fullname || user?.username || "User";

  const timeStr = msg.createdAt
    ? new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div
      className={`flex w-full gap-2 ${isOwn ? "justify-end" : "justify-start"}`}
    >
      {!isOwn && user?._id ? (
        <div className="mt-1 shrink-0 origin-bottom-left scale-[0.92] self-end">
          <UserPhoto userId={user._id} user={user} />
        </div>
      ) : null}

      <div
        className={`max-w-[min(85%,28rem)] rounded-2xl px-3.5 py-2.5 shadow-sm ring-1 transition ${
          isOwn ?
            "rounded-br-md bg-gradient-to-br from-blue-600 to-blue-700 text-white ring-blue-500/30"
          : "rounded-bl-md bg-white text-slate-900 ring-slate-200/80"
        }`}
      >
        <div className="mb-0.5 flex items-center justify-between gap-3">
          <span
            className={`text-[11px] font-bold uppercase tracking-wide ${
              isOwn ? "text-blue-100" : "text-slate-400"
            }`}
          >
            {label}
          </span>
          {timeStr ?
            <time
              dateTime={msg.createdAt}
              className={`text-[11px] tabular-nums ${
                isOwn ? "text-blue-100/90" : "text-slate-400"
              }`}
            >
              {timeStr}
            </time>
          : null}
        </div>
        <p
          className={`whitespace-pre-wrap break-words text-[15px] leading-relaxed ${
            isOwn ? "text-white" : "text-slate-800"
          }`}
        >
          {msg.text}
        </p>
        {isOwn ? (
          <div className="mt-1 flex justify-end">
            {messageSent ? (
              <span className="text-blue-100" title="Delivered">
                <i className="ri-check-double-line text-base" />
              </span>
            ) : (
              <span
                className={msg.seen ? "text-emerald-200" : "text-blue-100/80"}
                title={msg.seen ? "Seen" : "Sent"}
              >
                <i className="ri-check-line text-base" />
              </span>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default messgeBox;

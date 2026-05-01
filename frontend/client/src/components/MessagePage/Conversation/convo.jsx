import axios from "axios";
import UserPhoto from "../../userPhoto";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { getUser } from "../../../apiCalls";

function convo({
  onlineUsers,
  arrivalMessage,
  setConvoLoading,
  conversation,
  isActive,
}) {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [userLoading, setUserLoading] = useState(false);
  const { user: currentUser, yourNewMessage } = useContext(UserContext);
  const [latestMessage, setLatestMessage] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [arrivalMessages, setArrivalMessages] = useState([]);

  const peerOnline =
    user?._id &&
    Array.isArray(onlineUsers) &&
    onlineUsers.some((o) => o.userId === user._id);

  useEffect(() => {
    if (arrivalMessage) {
      setArrivalMessages((prev) => [arrivalMessage, ...prev]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    const fetchUser = async () => {
      setConvoLoading(true);
      try {
        if (conversation?.members && currentUser?._id) {
          const sender = conversation.members.find(
            (e) => e !== currentUser._id,
          );
          if (sender) {
            const u = await getUser(sender, 0);
            if (u) setUser(u);
          }
        }
      } catch (error) {
        console.warn("Convo user fetch:", error.message);
      } finally {
        setConvoLoading(false);
      }
    };
    fetchUser();
  }, [conversation, currentUser?._id, setConvoLoading]);

  useEffect(() => {
    const fetchLatestMessage = async () => {
      try {
        setLoadingMessage(true);
        if (user._id && currentUser?._id) {
          const res = await axios.get(
            `/api/messages/${currentUser._id}/${user._id}/latestMessage`,
          );

          if (!res.data?.text) {
            setLatestMessage("No messages yet.");
          } else {
            setLatestMessage(res.data.text);
          }
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setLatestMessage("No messages yet.");
        } else {
          console.error("Latest message:", error.message);
        }
      } finally {
        setLoadingMessage(false);
      }
    };

    fetchLatestMessage();
  }, [user._id, currentUser?._id]);

  const previewFromArrival =
    arrivalMessages[0]?.senderId &&
    conversation?.members?.includes(arrivalMessages[0].senderId) ?
      arrivalMessages[0].text
    : null;

  const previewFromDraft =
    yourNewMessage?.convoId === conversation._id &&
    yourNewMessage?.senderId === currentUser?._id ?
      yourNewMessage.text
    : null;

  const preview =
    previewFromArrival || previewFromDraft || latestMessage || "";

  const showArrivalBadge =
    arrivalMessages[0]?.senderId &&
    conversation?.members?.includes(arrivalMessages[0].senderId) &&
    arrivalMessages.length > 0;

  const displayName =
    user?.fullname || user?.username || user?.name || "Conversation";

  const openThread = () => {
    navigate(`/messages/${conversation._id}`);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={openThread}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openThread();
        }
      }}
      className={`group flex min-h-[72px] w-full cursor-pointer items-center gap-3 px-4 py-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 ${
        isActive ?
          "border-l-[3px] border-l-blue-600 bg-blue-50/90 hover:bg-blue-50"
        : "border-l-[3px] border-l-transparent hover:bg-slate-50"
      }`}
    >
      <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
        {userLoading || !user?._id ?
          <div className="h-12 w-12 animate-pulse rounded-full bg-slate-200" />
        : (
          <>
            <div className="origin-center scale-[0.94]">
              <UserPhoto onlineUsers={onlineUsers} userId={user._id} user={user} />
            </div>
            <span
              className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
                peerOnline ? "bg-emerald-500" : "bg-slate-300"
              }`}
              aria-hidden
            />
          </>
        )}
      </div>

      <div className="min-w-0 flex-1 py-0.5">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`truncate text-[15px] font-semibold ${
              isActive ? "text-blue-950" : "text-slate-900"
            }`}
          >
            {userLoading ? "…" : displayName}
          </p>
          {showArrivalBadge ?
            <span className="shrink-0 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              {arrivalMessages.length} new
            </span>
          : null}
        </div>

        <p
          className={`mt-0.5 line-clamp-2 text-[13px] leading-snug ${
            loadingMessage ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {loadingMessage ? "Loading preview…" : preview}
        </p>
      </div>

      <div
        className={`shrink-0 self-center text-lg transition ${
          isActive ?
            "text-blue-600"
          : "text-slate-300 group-hover:text-slate-500"
        }`}
        aria-hidden
      >
        <i className="ri-arrow-right-s-line" />
      </div>
    </div>
  );
}

export default convo;

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { UserContext } from "../../context/UserContext";
import MessageBox from "./messgeBox";
import { getUser } from "../../../apiCalls";
import UserPhoto from "../../userPhoto";

function Messages({ convoId, onlineUsers, userId, arrivalMessage }) {
  const { dispatch, user: currentUser } = useContext(UserContext);
  const [user, setUser] = useState({});
  const [messages, setMessages] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [convo, setConvo] = useState([]);
  const message = useRef();
  const socket = useRef();
  const scrollRef = useRef(null);
  const [inboxOpen, setInboxOpen] = useState([]);
  const [messageSent, setMessageSent] = useState(
    () =>
      Array.isArray(onlineUsers) &&
      onlineUsers.some((userObj) => userObj.userId === user?._id),
  );

  const orderedMessages = useMemo(
    () =>
      [...messages].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      ),
    [messages],
  );

  const peerOnline =
    user?._id &&
    Array.isArray(onlineUsers) &&
    onlineUsers.some((o) => o.userId === user._id);

  useEffect(() => {
    socket.current = io("ws://localhost:8900");

    socket.current.emit("visitInbox", {
      userId,
      convoId,
    });

    socket.current.on("getVisitInbox", (visitInbox) => {
      setInboxOpen(visitInbox);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [userId, convoId, user?._id]);

  useEffect(() => {
    if (!messageSent && user?._id && Array.isArray(onlineUsers)) {
      const isOnline = onlineUsers.some((userObj) => userObj.userId === user._id);
      if (isOnline) setMessageSent(true);
    }
  }, [onlineUsers, user?._id, messageSent]);

  useEffect(() => {
    const fetchConvo = async () => {
      if (!userId || !convoId) return;
      try {
        const res = await axios.get(`/api/convos/${convoId}/convoId`);
        setConvo(res.data);
      } catch (error) {
        console.error("Error fetching conversation:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConvo();
  }, [userId, convoId]);

  useEffect(() => {
    const fetchUser = async () => {
      setUserLoading(true);
      try {
        if (convo?.members) {
          const sender = convo.members.find((e) => e !== currentUser._id);
          if (sender) {
            const u = await getUser(sender, 0);
            setUser(u);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setUserLoading(false);
      }
    };

    if (convoId) fetchUser();
  }, [convoId, convo, currentUser._id]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!convoId) return;
      try {
        const res = await axios.get(`/api/messages/${convoId}`);
        const sortedMessages = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setMessages(sortedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [convoId]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (arrivalMessage) {
      const isDuplicate = messages.some(
        (msg) => msg.createdAt === arrivalMessage.createdAt,
      );

      if (!isDuplicate && convo?.members?.includes(arrivalMessage.senderId)) {
        setMessages((prevMessages) => [arrivalMessage, ...prevMessages]);
      }
    }
  }, [arrivalMessage, convo, convoId, messages]);

  useEffect(() => {
    const updatingSeen = async () => {
      if (user && messages && Array.isArray(inboxOpen)) {
        const updatedInbox = inboxOpen.find(
          (person) => person.userId === user._id && person.convoId === convoId,
        );

        if (!updatedInbox) return;

        try {
          const updatedMessages = [];
          for (const msg of messages) {
            if (msg.seen) continue;
            try {
              if (msg._id) {
                const response = await axios.put(
                  `/api/messages/${msg._id}/seen`,
                );

                if (response.status === 200) {
                  updatedMessages.push({
                    ...msg,
                    seen: true,
                  });
                }
              }
            } catch (error) {
              console.error(
                `Error updating message ${msg._id} as seen:`,
                error.response?.data?.message || error.message,
              );
            }
          }

          if (updatedMessages.length > 0) {
            setMessages((prevMessages) =>
              prevMessages.map(
                (msg) => updatedMessages.find((um) => um._id === msg._id) || msg,
              ),
            );
          }
        } catch (error) {
          console.error("Unexpected error during updating messages:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    updatingSeen();
  }, [userId, convoId, user, inboxOpen, messages]);

  const handleMsgSubmit = async (e) => {
    e.preventDefault();
    const text = message.current?.value?.trim() ?? "";
    if (!text) return;

    try {
      const newMessage = {
        convoId,
        senderId: userId,
        text,
      };

      const recieverId = convo?.members.find(
        (member) => member !== currentUser._id,
      );

      if (recieverId && socket.current) {
        socket.current.emit("sendMessage", {
          senderId: currentUser._id,
          recieverId,
          text,
        });
        dispatch({
          type: "YOUR_NEW_MESSAGE",
          payload: {
            convoId,
            senderId: currentUser._id,
            text,
          },
        });
      }

      const msgResponse = await axios.post(`/api/messages`, newMessage);
      if (msgResponse.data) {
        setMessages((prevMessages) => [msgResponse.data, ...prevMessages]);
      }
      message.current.value = "";
    } catch (error) {
      console.error(
        "An error occurred:",
        error.response?.data || error.message || error,
      );
    }
  };

  const displayName =
    user?.fullname || user?.username || user?.name || "Conversation";

  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-100/80">
      <header className="relative z-10 flex shrink-0 items-center gap-3 border-b border-slate-200/90 bg-white px-3 py-3 shadow-sm sm:px-4">
        <div className="relative shrink-0">
          {userLoading || !user?._id ? (
            <div className="h-11 w-11 animate-pulse rounded-full bg-slate-200" />
          ) : (
            <UserPhoto userId={user._id} user={user} />
          )}
          {!userLoading && user?._id ? (
            <span
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                peerOnline ? "bg-emerald-500" : "bg-slate-300"
              }`}
              title={peerOnline ? "Online" : "Offline"}
              aria-hidden
            />
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[17px] font-bold tracking-tight text-slate-900">
            {userLoading ? "Loading…" : displayName}
          </h1>
          <p className="truncate text-xs font-medium text-slate-500">
            {peerOnline ? "Active now" : "Not active"}
          </p>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-5 [scrollbar-width:thin]"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
            <p className="text-sm font-medium text-slate-600">
              Loading messages…
            </p>
          </div>
        ) : orderedMessages.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200/80 text-slate-500">
              <i className="ri-chat-3-line text-2xl" />
            </div>
            <p className="text-base font-semibold text-slate-800">
              No messages yet
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-slate-500">
              Say hello — your message will appear here instantly.
            </p>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-1 pb-2">
            {orderedMessages.map((msg) => (
              <MessageBox
                key={msg._id || `${msg.senderId}-${msg.createdAt}`}
                user={user}
                socket={socket}
                senderId={msg.senderId}
                msg={msg}
                messageSent={messageSent}
              />
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={handleMsgSubmit}
        className="shrink-0 border-t border-slate-200/90 bg-white px-3 py-3 shadow-[0_-8px_30px_-12px_rgba(15,23,42,0.12)] sm:px-4"
        style={{
          paddingBottom: "max(12px, env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div className="mx-auto flex w-full max-w-3xl items-end gap-2 sm:gap-3">
          <label htmlFor="thread-message-input" className="sr-only">
            Message
          </label>
          <input
            id="thread-message-input"
            ref={message}
            type="text"
            autoComplete="off"
            placeholder="Write a message…"
            className="min-h-[48px] min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-3 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
          <button
            type="submit"
            className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] active:bg-blue-800"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default Messages;

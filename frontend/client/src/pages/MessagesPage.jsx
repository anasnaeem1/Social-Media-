import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Coverstations from "../components/MessagePage/Conversation/coverstations";
import Messages from "../components/MessagePage/Messages/messages";
import { UserContext } from "../components/context/UserContext";
import axios from "axios";

function ChatApp() {
  const [conversations, setConversations] = useState([]);
  const [convoLoading, setConvoLoading] = useState(true);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useContext(UserContext);
  const { convoId } = useParams();

  useEffect(() => {
    const fetchConvos = async () => {
      setConvoLoading(true);
      try {
        const res = await axios.get(`/api/convos/${user._id}/userId`);
        setConversations(res.data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setConvoLoading(false);
      }
    };

    if (user) {
      fetchConvos();
    }
  }, [user]);

  return (
    <div className="flex h-[calc(100vh-65px)]">
      <div
        className={`${
          convoId ? "hidden md:block" : ""
        } flex w-full min-w-0 shrink-0 flex-col border-r border-slate-200/90 bg-slate-100/80 md:w-[min(100%,380px)] lg:w-[400px]`}
      >
        {conversations.length > 0 || convoLoading ?
          <Coverstations
            onlineUsers={onlineUsers}
            arrivalMessage={arrivalMessage}
            setConvoLoading={setConvoLoading}
            conversations={conversations}
            convoId={convoId}
            isLoading={convoLoading}
          />
        : (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-sm text-slate-500">
            <i className="ri-inbox-line text-3xl text-slate-300" aria-hidden />
            <p>No conversations yet</p>
          </div>
        )}
      </div>

      <div className="flex-grow overflow-hidden">
        {convoId ? (
          <Messages
            onlineUsers={onlineUsers}
            arrivalMessage={arrivalMessage && arrivalMessage}
            userId={user._id}
            convoId={convoId}
          />
        ) : (
          <p className="hidden md:flex text-gray-500 justify-center items-center h-full">
            Select a conversation to view messages
          </p>
        )}
      </div>
    </div>
  );
}

export default ChatApp;


import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Coverstations from "./Conversation/coverstations";
import Messages from "./Messages/messages";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";

function ChatApp() {
  const [conversations, setConversations] = useState([]);
  const [convoLoading, setConvoLoading] = useState(true);
  const socket = useRef();
  const { user } = useContext(AuthContext);
  const PA = import.meta.env.VITE_PUBLIC_API;
  const { convoId } = useParams();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socket.current = io("ws://localhost:8900");

    socket.current.on("getMessage", (data) => {
      // console.log("Received message:", data);
      setArrivalMessage({
        senderId: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });

    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(users)
    });

    return () => {
      // Clean up and disconnect socket when component is unmounted or message component is closed
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    // Fetch conversations for the current user
    const fetchConvos = async () => {
      setConvoLoading(true);
      try {
        const res = await axios.get(`${PA}/api/convos/${user._id}/userId`);
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
      {/* Conversation Panel */}
      <div
        className={`${
          convoId ? "hidden md:block" : ""
        } w-full md:w-[350px] border bg-gray-50`}
      >
        {/* <h1>{arrivalMessage && arrivalMessage.text}</h1> */}
        {conversations.length > 0 ? (
          <Coverstations
          onlineUsers={onlineUsers}
            arrivalMessage={arrivalMessage}
            socket={socket}
            setConvoLoading={setConvoLoading}
            conversations={conversations}
            userId={user._id}
            convoId={convoId}
          />
        ) : (
          <p className="text-gray-500">No conversations found</p>
        )}
      </div>

      {/* Messages Panel */}
      <div className="flex-grow overflow-hidden">
        {convoId ? (
          <Messages
          onlineUsers={onlineUsers}
            arrivalMessage={arrivalMessage}
            socket={socket}
            conversations={conversations}
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

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
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const { user } = useContext(AuthContext);
  const PA = import.meta.env.VITE_PUBLIC_API;
  const { convoId } = useParams();


  useEffect(() => {
    // Initialize socket connection
    socket.current = io("ws://localhost:8900", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket", "polling"],
    });
  
    const setupSocketListeners = () => {
      // Handle incoming messages
      socket.current.on("getMessage", (data) => { 
        console.log("Message received:", data);
        if (data) {
          setArrivalMessage({
            senderId: data.senderId,
            text: data.text,
            createdAt: Date.now(),
          });
        }
      });

      socket.current.on("getUsers", (users) => {
        setOnlineUsers(users);  
      });
  
      // Handle connection errors
      socket.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });
    };
  
    // Set up listeners
    setupSocketListeners();
  
    // Handle socket connection
    socket.current.on("connect", () => {
      console.log("Connected to socket server:", socket.current.id);
      socket.current.emit("addUser", user._id); // Register user
    });
  
    socket.current.on("reconnect", () => {
      console.log("Reconnected to socket server:", socket.current.id);
      socket.current.emit("addUser", user._id); // Re-register user on reconnect
    });
  
    return () => {
      // Cleanup all listeners on unmount
      socket.current.off("getMessage");
      socket.current.off("getUsers");
      socket.current.off("connect");
      socket.current.off("connect_error");
      socket.current.off("reconnect");
      socket.current.disconnect();
    };
  }, [user._id]);
  
  

  useEffect(() => {
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
            arrivalMessage={arrivalMessage && arrivalMessage}
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

import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { UserContext } from "../../../context/UserContext";
import MessageBox from "./messgeBox";
import { io } from "socket.io-client";
import Conversations from "../Conversation/coverstations";

function Messages({
  convoId,
  onlineUsers,
  userId,
  conversations,
  arrivalMessage,
}) {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER || "/images/";
  const {
    dispatch,
    yourNewMessage,
    user: currentUser,
  } = useContext(UserContext);
  const [user, setUser] = useState({});
  const [messages, setMessages] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [convo, setConvo] = useState([]);
  const PA = import.meta.env.VITE_PUBLIC_API;
  const message = useRef();
  const socket = useRef();
  const messagesEndRef = useRef(null);
  const [inboxOpen, setInboxOpen] = useState([]);
  const [messageSent, setMessageSent] = useState(
    onlineUsers.some((userObj) => userObj.userId === user._id)
  );

  // Check if otherUser is in the inbox?
  useEffect(() => {
    socket.current = io("ws://localhost:8900");

    socket.current.emit("visitInbox", {
      userId,
      convoId,
    });

    socket.current.on("getVisitInbox", (visitInbox) => {
      // console.log("People who are in the inbox:", visitInbox);
      setInboxOpen(visitInbox);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [userId, convoId, user]);

  // check How Many people are online
  useEffect(() => {
    if (!messageSent) {
      const isOnline = onlineUsers.some(
        (userObj) => userObj.userId === user._id
      );
      if (isOnline) {
        setMessageSent(true);
      }
    }
  }, [onlineUsers, user._id, messageSent]);

  // Fetching Conversations
  useEffect(() => {
    const fetchConvo = async () => {
      if (userId) {
        try {
          const res = await axios.get(`/api/convos/${convoId}/convoId`);
          setConvo(res.data);
          // console.log(res.data)
        } catch (error) {
          console.error("Error fetching conversation:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchConvo();
  }, [userId, convoId]);

  // Fetching Other User
  useEffect(() => {
    const fetchUser = async () => {
      setUserLoading(true);
      try {
        if (convo?.members) {
          const sender = convo.members.find((e) => e !== currentUser._id);
          if (sender) {
            const user = await getUser(sender, 0);
            setUser(user);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setUserLoading(false);
      }
    };

    if (convoId) {
      fetchUser();
    }
  }, [convoId, convo, currentUser]);

  // Fetching Messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/messages/${convoId}`);
        const sortedMessages = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        // console.log("Fetched and sorted messages:", sortedMessages);
        setMessages(sortedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (convoId) {
      fetchMessages();
    }
  }, [convoId]);

  // Clearing message input
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Setting Arrival Messages
  useEffect(() => {
    if (arrivalMessage) {
      const isDuplicate = messages.some(
        (msg) => msg.createdAt === arrivalMessage.createdAt
      );

      if (!isDuplicate && convo?.members?.includes(arrivalMessage.senderId)) {
        setMessages((prevMessages) => [arrivalMessage, ...prevMessages]);
      }
    }
  }, [arrivalMessage, convo, convoId, messages]);

  // Updating Message Seen Feature
  useEffect(() => {
    const updatingSeen = async () => {
      if (user && messages && Array.isArray(inboxOpen)) {
        const updatedInbox = inboxOpen.find(
          (person) => person.userId === user._id && person.convoId === convoId
        );

        // Check if the inbox is open for the user
        if (!updatedInbox) return;

        try {
          const updatedMessages = [];
          for (const message of messages) {
            if (message.seen) continue;
            try {
              if (message._id) {
                const response = await axios.put(
                  `/api/messages/${message._id}/seen`
                );

                if (response.status === 200) {
                  updatedMessages.push({
                    ...message,
                    seen: true, // Update the `seen` status locally
                  });
                } else {
                  console.error(
                    `Failed to update message ${message._id}:`,
                    response.data.message
                  );
                }
              }
            } catch (error) {
              console.error(
                `Error updating message ${message._id} as seen:`,
                error.response?.data?.message || error.message
              );
            }
          }

          // Update the messages state with seen messages
          if (updatedMessages.length > 0) {
            setMessages((prevMessages) =>
              prevMessages.map(
                (msg) => updatedMessages.find((um) => um._id === msg._id) || msg
              )
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

  // Handle message submit
  const handleMsgSubmit = async (e) => {
    e.preventDefault();
    try {
      const newMessage = {
        convoId: convoId,
        senderId: userId,
        text: message.current.value,
      };

      const recieverId = convo?.members.find(
        (member) => member !== currentUser._id
      );

      if (recieverId) {
        socket.current.emit("sendMessage", {
          senderId: currentUser._id,
          recieverId,
          text: message.current.value,
        });
        dispatch({
          type: "YOUR_NEW_MESSAGE",
          payload: {
            convoId: convoId,
            senderId: currentUser._id,
            text: message.current.value,
          },
        });
      }

      if (message.current.value.trim() !== "") {
        const msgResponse = await axios.post(`/api/messages`, newMessage);
        if (msgResponse.data) {
          setMessages((prevMessages) => [msgResponse.data, ...prevMessages]);
          // dispatch({ type: "YOUR_NEW_MESSAGE", payload: newMessage.text });
        }
        message.current.value = "";
      } else {
        console.log("Message is empty or only contains spaces");
      }
    } catch (error) {
      console.error(
        "An error occurred:",
        error.response?.data || error.message || error
      );
    }
  };

  return (
    <div className="flex flex-col h-full max-w-[1400px] bg-[#e6f7ff] shadow-lg rounded-xl">
      <div className="p-4 h-full flex flex-col-reverse overflow-y-auto relative">
        {isLoading ? (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white py-1.5 px-3 rounded-md shadow-sm text-gray-700 border border-gray-200">
            <p className="text-center text-sm">Loading messages...</p>
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg, index) => (
            <MessageBox
              user={user}
              socket={socket}
              key={index}
              senderId={msg.senderId}
              msg={msg}
            />
          ))
        ) : (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white py-1.5 px-3 rounded-md shadow-sm text-gray-700 border border-gray-200">
            <p className="text-center text-sm">
              Be the first to send a message!
            </p>
          </div>
        )}
      </div>

      <form
        onSubmit={handleMsgSubmit}
        className="flex items-center gap-3 mt-auto bg-white py-3 px-4 rounded-t-lg shadow-inner"
      >
        <input
          ref={message}
          type="text"
          placeholder="Type a message..."
          className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 transition"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Send
        </button>
      </form>

      <div ref={messagesEndRef} />
    </div>
  );
}

export default Messages;

import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import UserPhoto from "../../../userPhoto";
import { io } from "socket.io-client";

function Messages({
  convoId,
  onlineUsers,
  userId,
  conversations,
  socket,
  arrivalMessage,
}) {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [messages, setMessages] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [convo, setConvo] = useState([]);
  const PA = import.meta.env.VITE_PUBLIC_API;
  const message = useRef();
  const messagesEndRef = useRef(null);
  const [messageSent, setMessageSent] = useState(
    onlineUsers.some((userObj) => userObj.userId === user._id)
  );

  useEffect(() => {
    // Only update messageSent if it is currently false
    if (!messageSent) {
      const isOnline = onlineUsers.some(
        (userObj) => userObj.userId === user._id
      );
      if (isOnline) {
        setMessageSent(true); // Once true, it will not change again
      }
    }
  }, [onlineUsers, user._id, messageSent]);

  // useEffect(() => {

  // }, []);

  useEffect(() => {
    const fetchConvo = async () => {
      if (userId) {
        try {
          const res = await axios.get(`${PA}/api/convos/${convoId}/convoId`);
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

  useEffect(() => {
    const fetchUser = async () => {
      setUserLoading(true);
      try {
        if (convo?.members) {
          const sender = convo.members.find((e) => e !== currentUser._id);
          if (sender) {
            const res = await axios.get(`${PA}/api/users?userId=${sender}`);
            setUser(res.data);
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

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${PA}/api/messages/${convoId}`);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // console.log(convo?.members.includes(user._id))
    if (arrivalMessage) {
      convo?.members.includes(arrivalMessage.senderId) &&
        setMessages((prevMessages) => [arrivalMessage, ...prevMessages]);
      // console.log(messages);
    }
  }, [arrivalMessage, convo, convoId]);

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
      }

      if (message.current.value.trim() !== "") {
        const msgResponse = await axios.post(`${PA}/api/messages`, newMessage);
        setMessages((prevMessages) => [msgResponse.data, ...prevMessages]);
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
            <div
              key={index}
              className={`flex ${
                userId === msg.senderId
                  ? "self-end flex-row-reverse"
                  : "self-start"
              } w-fit max-w-[800px] py-3 px-4 rounded-lg mb-6 gap-2 shadow-md transition-transform transform hover:scale-[1.02]`}
              style={{
                background:
                  userId === msg.senderId
                    ? "#1e40af"
                    : "rgba(255, 255, 255, 0.9)",
                color: userId === msg.senderId ? "white" : "black",
              }}
            >
              {userId !== msg.senderId && (
                <UserPhoto
                  userId={user._id}
                  user={user}
                  className="w-8 h-8 rounded-full shadow-sm"
                />
              )}
              <div className="flex flex-col break-words max-w-full">
                <h1
                  className={`font-semibold text-sm ${
                    userId === msg.senderId ? "text-white" : "text-gray-800"
                  }`}
                >
                  {userId === msg.senderId ? "You" : user.username}
                </h1>
                <p
                  className={`text-base leading-6 ${
                    userId === msg.senderId ? "text-white" : "text-gray-700"
                  }`}
                >
                  {msg.text}
                </p>
                <div className="text-right mt-1 flex justify-between items-center">
                  <p
                    className={`text-xs ${
                      userId === msg.senderId
                        ? "text-gray-300"
                        : "text-gray-500"
                    }`}
                  >
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Just now"}
                  </p>
                  {userId === msg.senderId ? messageSent ? (
                    <span className="text-gray-300">
                      <i className="ri-check-double-line"></i>
                    </span>
                  ) : (
                    <span className="text-gray-300">
                      <i className="ri-check-line"></i>
                    </span>
                  ):""}
                </div>
              </div>
            </div>
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

// {
//   _id: "675f44cab8d6c943fd6768d0",
//   convoId: "6751ef3b015093a8a666d029",
//   senderId: "673a3277a42f1c300d399772",
//   text: "hey",
//   createdAt: "2024-12-15T21:06:18.496Z",
// },

// {
//   _id: "675f2e7bb8d6c943fd6761bb",
//   convoId: "6751ef3b015093a8a666d029",
//   senderId: "673a3277a42f1c300d399772",
//   text: "trying again",
//   createdAt: "2024-12-15T19:31:07.431Z",
// },

// {
//   _id: "675f2e3db8d6c943fd6761b9",
//   convoId: "6751ef3b015093a8a666d029",
//   senderId: "673a3277a42f1c300d399772",
//   text: "hello",
//   createdAt: "2024-12-15T19:30:05.041Z",
// },

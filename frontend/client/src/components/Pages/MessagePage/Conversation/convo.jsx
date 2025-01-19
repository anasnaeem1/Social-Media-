import axios from "axios";
import UserPhoto from "../../../userPhoto";
import CurrentUserPhoto from "../../../currentUserPhoto";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContext";

function convo({
  onlineUsers,
  arrivalMessage,
  convoId,
  setConvoLoading,
  conversation,
}) {
  const [user, setUser] = useState({});
  const [userLoading, setUserLoading] = useState(false);
  // const [userLoading, setUserLoading] = useState(false);
  const { user: currentUser, yourNewMessage } = useContext(UserContext);
  const PF = import.meta.env.VITE_PUBLIC_FOLDER || "/images/";
  const PA = import.meta.env.VITE_PUBLIC_API;
  const [latestMessage, setLatestMessage] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(null);
  const [isUserInConversation, setIsUserInConversation] = useState(false);
  const [arrivalMessages, setArrivalMessages] = useState([]);

  useEffect(() => {
    if (arrivalMessage) {
      setArrivalMessages((prev) => [arrivalMessage, ...prev]);
    }
  }, [arrivalMessage]);

  // if(arrivalMessages.length > 0 ) {
  // console.log(arrivalMessages);
  // }


  useEffect(() => {
    const fetchUser = async () => {
      setConvoLoading(true);
      try {
        if (conversation.members) {
          const sender = conversation.members.find(
            (e) => e !== currentUser._id
          );
          // console.log(sender);
          if (sender) {
            const res = await axios.get(`/api/users?userId=${sender}`);
            if (!res.data) {
              console.log("No message Found");
            } else {
              setUser(res.data);
            }
          }
        }
      } catch (error) {
        console.log("Error at fetching", error);
      } finally {
        setConvoLoading(false);
      }
    };
    fetchUser();
  }, [conversation]);

  useEffect(() => {
    // console.log(arrivalMessage)
    const fetchLatestMessage = async () => {
      try {
        setLoadingMessage(true);
        if (user._id && currentUser._id) {
          const res = await axios.get(
            `/api/messages/${currentUser._id}/${user._id}/latestMessage`
          );

          if (!res.data || !res.data.text) {
            setLatestMessage("No messages yet.");
          } else {
            setLatestMessage(res.data.text);
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.warn("No messages found (404).");
          setLatestMessage("No messages yet.");
        } else {
          console.error("Error fetching the latest message:", error.message);
        }
      } finally {
        setLoadingMessage(false);
      }
    };

    fetchLatestMessage();
  }, [user._id, currentUser._id]);

  return (
    <div className="flex items-center gap-4 w-full border p-3 rounded-md shadow-sm hover:shadow-lg bg-white transition-all duration-200 ease-in-out cursor-pointer">
      {/* User Photo */}  
      <div className="relative flex-shrink-0">
        <UserPhoto
          onlineUsers={onlineUsers}
          userId={user._id}
          user={user}
          className="w-12 h-12 rounded-full border-2 border-gray-200 shadow-md hover:scale-105 transition-transform duration-200 ease-in-out"
        />
      </div>

      {/* Conversation Info */}
      <Link to={`/messages/${conversation._id}`} className="flex-1">
        <div className="flex flex-col">
          <div className="flex justify-between">
            <p className="text-black font-semibold text-base">
              {user.username}
            </p>
            {arrivalMessages[0]?.senderId &&
              conversation?.members.includes(arrivalMessages[0].senderId) && (
                <p className="text-blue-500 font-normal text-sm">
                  {arrivalMessages.length} messages
                </p>
              )}
          </div>

          {/* Display latest message based on priority */}
          {arrivalMessages[0]?.senderId &&
          conversation?.members.includes(arrivalMessages[0].senderId) ? (
            /* Show the latest arrival message */
            <p className="text-gray-600 text-sm truncate">
              {arrivalMessages[0].text.length > 23
                ? `${arrivalMessages[0].text.slice(0, 23)}...` // Limit to 23 characters
                : arrivalMessages[0].text}
            </p>
          ) : yourNewMessage?.convoId === conversation._id &&
            yourNewMessage?.senderId === currentUser?._id ? (
            /* Show yourNewMessage if convoId matches */
            <p className="text-gray-600 text-sm truncate">
              {yourNewMessage.text.length > 23
                ? `${yourNewMessage.text.slice(0, 23)}...` // Limit to 23 characters
                : yourNewMessage.text}
            </p>
          ) : latestMessage ? (
            /* Default to latestMessage */
            <p className="text-gray-600 text-sm truncate">
              {latestMessage.length > 23
                ? `${latestMessage.slice(0, 23)}...` // Limit to 23 characters
                : latestMessage}
            </p>
          ) : (
            /* Placeholder text if no messages */
            <p className="text-gray-400 text-sm">No messages yet</p>
          )}
        </div>
      </Link>

      {/* Arrow Icon */}
      <div
        className={`${
          onlineUsers.some((userObj) => userObj.userId === user._id)
            ? "text-blue-500"
            : "text-gray-400"
        }  hover:text-gray-600 transition-colors duration-200`}
      >
        <i className="ri-arrow-right-s-line text-xl"></i>
      </div>
    </div>
  );
}
export default convo;

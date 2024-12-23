import { useContext, useEffect, useState } from "react";
import UserPhoto from "../../../userPhoto";
import { AuthContext } from "../../../context/AuthContext";

function messgeBox({ senderId, user, socket, msg, messageSent }) {
  const { user: currentUser } = useContext(AuthContext);
  const userId = currentUser?._id;

  return (
    <div
      className={`flex  ${
        userId === senderId ? "self-end flex-row-reverse" : "self-start"
      } w-fit max-w-[800px] py-3 px-4 rounded-lg mb-6 gap-2 shadow-md transition-transform transform hover:scale-[1.02]`}
      style={{
        background:
          userId === senderId ? "#1e40af" : "rgba(255, 255, 255, 0.9)",
        color: userId === senderId ? "white" : "black",
      }}
    >
      {userId !== senderId && (
        <UserPhoto
          userId={msg._senderId}
          user={user}
          className="w-8 h-8 rounded-full shadow-sm"
        />
      )}
      <div className="flex flex-col break-words max-w-full">
        <h1
          className={`font-semibold text-sm ${
            userId === senderId ? "text-white" : "text-gray-800"
          }`}
        >
          {userId === senderId ? "You" : user.username}
        </h1>
        <p
          className={`text-base leading-6 ${
            userId === senderId ? "text-white" : "text-gray-700"
          }`}
        >
          {msg.text}
        </p>
        <div className="text-right mt-1 flex justify-between items-center">
          <p
            className={`text-xs ${
              userId === senderId ? "text-gray-300" : "text-gray-500"
            }`}
          >
            {msg.createdAt
              ? new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Just now"}
          </p>
          {userId === senderId ? (
            messageSent ? (
              <span className="text-gray-300">
                <i className="ri-check-double-line"></i>
              </span>
            ) : (
              <span
                className={`${msg.seen ? "text-red-500" : "text-gray-300"}`}
              >
                <i className="ri-check-line"></i>
              </span>
            )
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
export default messgeBox;

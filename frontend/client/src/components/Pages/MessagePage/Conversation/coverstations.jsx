import { useContext, useEffect, useState } from "react";
import FriendList from "../../Home/friendList";
import { UserContext } from "../../../context/UserContext";
import Convo from "./convo";

function Conversations({
  onlineUsers,
  socket,
  setConvoLoading,
  arrivalMessage,
  isLoading,
  conversations,
  userId,
}) {
  const { user } = useContext(UserContext);


  return (
    <div
      className={` custom-scrollbar overflow-y-auto h-full w-full bg-gray-50 shadow-lg`}
    >
      <div className="flex flex-col gap-4 p-4">
        <h2 className="text-blue-500 font-semibold flex flex- col text-xl mb-3">
          Friends
        </h2>
        {isLoading ? (
          <p className="text-gray-500">Loading conversations...</p>
        ) : conversations.length > 0 ? (
          conversations.map((conversation) => (
            <div key={conversation._id} className="">
              <Convo
                onlineUsers={onlineUsers}
                socket={socket}
                arrivalMessage={arrivalMessage}
                setConvoLoading={setConvoLoading}
                conversation={conversation}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500">No friends found</p>
        )}
      </div>
    </div>
  );
}

export default Conversations;

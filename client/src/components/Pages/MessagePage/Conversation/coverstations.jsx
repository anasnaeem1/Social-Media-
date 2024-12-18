import { useContext, useEffect, useState } from "react";
import FriendList from "../../Home/friendList";
import { AuthContext } from "../../../context/AuthContext";
import Convo from "./convo"

function Conversations({socket, setConvoLoading, arrivalMessage, isLoading, conversations, userId }) {
  const { user } = useContext(AuthContext);

  // const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  // const PA = import.meta.env.VITE_PUBLIC_API;
  // console.log(conversations);

  return (
    <div
      className={` custom-scrollbar overflow-y-auto h-full w-full bg-gray-50 shadow-lg`}
    >
      <div className="flex flex-col gap-4 p-4">
        <h2 className="text-blue-500 font-semibold text-xl mb-3">Friends</h2>
        {isLoading ? (
          <p className="text-gray-500">Loading conversations...</p>
        ) : conversations.length > 0 ? (
          conversations.map((conversation) => (
            <div
              key={conversation._id}
              className=""
            >
             <Convo socket={socket} arrivalMessage={arrivalMessage} setConvoLoading={setConvoLoading} conversation={conversation}/>
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

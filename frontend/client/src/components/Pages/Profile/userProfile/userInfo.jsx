import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";

function UserInfo({ profileUser }) {
  const [friendList, setFriendList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [makingConvo, setMakingConvo] = useState(false);

  const { user } = useContext(UserContext);
  const PF = import.meta.env.VITE_PUBLIC_FOLDER || "/images/";
  const PA = import.meta.env.VITE_PUBLIC_API;

  useEffect(() => {
    if (profileUser._id) {
      const fetchFriends = async () => {
        try {
          const res = await axios.get(
            `/api/users/friends/${profileUser._id}`
          );
          // console.log(res.data);
          // if(res.data) => {}
          setFriendList(res.data);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
      };
      fetchFriends();
    }
  }, [profileUser]);

  return (
    <div className="normal lg:sticky top-[100px] right-0 w-full lg:w-[400px] flex flex-col gap-4">
      {/* USER INFO */}
      <div className="bg-white rounded-lg p-4">
        <h1 className="text-lg font-semibold border-b pb-2 mb-4">
          About {profileUser.username}
        </h1>
        <div className="flex flex-col gap-3">
          {/* City */}
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-800">City:</span>
            <span className="text-gray-600 font-medium">
              {profileUser.city}
            </span>
          </div>
          {/* From */}
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-800">From:</span>
            <span className="text-gray-600 font-medium">
              {profileUser.from}
            </span>
          </div>
          {/* Relationship */}
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-800">Relationship:</span>
            <span className="text-gray-600 font-medium">
              {profileUser.relationship === 1
                ? "Single"
                : profileUser.relationship === 2
                ? "Taken"
                : profileUser.relationship === 3
                ? "Married"
                : "Unknown"}
            </span>
          </div>
        </div>
      </div>

      {/* USER FRIENDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {isLoading ? (
          <p>Loading Friends...</p>
        ) : friendList.length > 0 ? (
          friendList.map((Friend, index) => (
            <Link to={`/profile/${Friend._id}`} key={index}>
              <div
                className={`flex flex-col items-center gap-2 text-center ${
                  index >= 4 && index < 6 ? "hidden sm:block" : ""
                } && ${index >= 6 ? "hidden" : undefined}`}
              >
                <img
                  src={
                    Friend.profilePic
                      ? `${PF}/${Friend.profilePic}`
                      : `${PF}/noAvatar.png`
                  }
                  alt={`${Friend.fname} ${Friend.lname}`}
                  className="rounded-md w-full aspect-square object-cover"
                />
                <div>
                  <span>{Friend.username}</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No friends found</p>
        )}
      </div>
    </div>
  );
}

export default UserInfo;

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";

function UserInfo({ profileUser }) {
  const [friendList, setFriendList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useContext(UserContext);

  useEffect(() => {
    if (profileUser._id) {
      const fetchFriends = async () => {
        try {
          const res = await axios.get(`/api/users/friends/${profileUser._id}`);
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
    <div className="lg:sticky top-[80px] h-auto userInfo-Box right-0 w-full lg:w-[300px] flex flex-col gap-4">
      {/* USER INFO */}
      <div className="bg-white rounded-lg p-3 sm:p-4">
        <h1 className="text-md sm:text-lg font-semibold border-b pb-2 mb-4">
          About {profileUser.fullname}
        </h1>
        <div className="flex flex-col gap-3">
          {/* City */}
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-medium text-gray-800">City:</span>
            <span className="text-gray-600 font-medium">
              {profileUser.city}
            </span>
          </div>
          {/* From */}
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-medium text-gray-800">From:</span>
            <span className="text-gray-600 font-medium">
              {profileUser.from}
            </span>
          </div>
          {/* Relationship */}
          <div className="flex items-center justify-between text-xs sm:text-sm">
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
      <div className="bg-white rounded-lg p-3 sm:p-4">
        <h2 className="text-md sm:text-lg font-semibold border-b pb-2 mb-4">
          Friends
        </h2>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {isLoading ? (
            <p className="text-xs sm:text-sm">Loading Friends...</p>
          ) : friendList.length > 0 ? (
            friendList.map((Friend, index) => (
              <Link to={`/profile/${Friend._id}`} key={index}>
                <div
                  className={`flex flex-col items-center gap-2 text-center ${
                    index >= 6 ? "" : ""
                  }`}
                >
                  <img
                    src={
                      Friend.profilePic
                        ? `${Friend.profilePic}`
                        : `/images/noAvatar.png`
                    }
                    alt={`${Friend.fname} ${Friend.lname}`}
                    className="rounded-md w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] object-cover"
                  />
                  <div>
                    <span className="text-xs sm:text-sm font-medium text-gray-800">
                      {Friend.fullname}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-xs sm:text-sm">No friends found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserInfo;

import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function userInfo({ profileUser }) {
  const [friendList, setFriendList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const PA = import.meta.env.VITE_PUBLIC_API;

  // console.log(user._id);

  useEffect(() => {
    if (profileUser._id) {
      const fetchFriends = async () => {
        try {
          const res = await axios.get(`${PA}/api/users/friends/${profileUser._id}`);
          setFriendList(res.data);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
      };
      fetchFriends();
    }
  }, [profileUser]);

  // console.log(friendList)

  return (
    <div>
      {" "}
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
              <span className="text-gray-600 font-medium">{profileUser.city}</span>
            </div>
            {/* From */}
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800">From:</span>
              <span className="text-gray-600 font-medium">{profileUser.from}</span>
            </div>
            {/* Relationship */}
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800">Relationship:</span>
              <span className="text-gray-600 font-medium">
                {profileUser.relationship === 1
                  ? "Single"
                  : profileUser.relationship === 2
                  ? "Mingle"
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
            <p>loading Friends...</p>
          ) : friendList.length > 0 ? (
            friendList.map((Friend, index) => (
              <Link to={`/profile/${Friend.username}`} key={index}>
              <div
                className={`flex flex-col items-center gap-2 text-center ${
                  index >= 4 && index < 6 ? "hidden sm:block" : ""
                } && ${index >= 6 ? "hidden" : undefined}`}
              >
                <img
                  src={
                    Friend.profilePic
                      ? `${PF}/Person/${Friend.profilePic}`
                      : `${PF}/Person/noAvatar.jpg`
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
            <p>no friends found</p>
          )}
        </div>
      </div>
    </div>
  );
  // src={`${PF}/postImages${Friend.profilePic}`}
}
export default userInfo;

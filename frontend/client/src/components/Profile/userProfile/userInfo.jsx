import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

function UserInfo({ profileUser }) {
  const [friendList, setFriendList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(UserContext);
  
  useEffect(() => {
    if (profileUser._id) {
      const fetchFriends = async () => {
        try {
          setIsLoading(true);
          const res = await axios.get(`/api/users/friends/${profileUser._id}`);
          if (res.data) {
            setFriendList(res.data);
            // console.log("friendsList", res.data);
          }
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
      };
      fetchFriends();
    }
  }, [profileUser]);

  return (
    <aside
      className="flex h-auto w-full shrink-0 flex-col gap-4 lg:sticky lg:top-[81px] lg:w-[300px] lg:max-h-[calc(100vh-81px)] lg:overflow-y-auto lg:overflow-x-hidden xl:w-[320px] custom-scrollbar"
      aria-label="Profile details"
    >
      {/* USER INFO */}
      <div className="w-full rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <h2 className="mb-3 border-b border-slate-100 pb-2 text-base font-semibold text-slate-900 sm:text-lg">
          About {profileUser?.fullname ?? ""}
        </h2>
        <div className="flex w-full flex-col gap-3">
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
      <div className="w-full rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <h2 className="mb-3 border-b border-slate-100 pb-2 text-base font-semibold text-slate-900 sm:text-lg">
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
                        : `https://res.cloudinary.com/datcr1zua/image/upload/v1739709690/uploads/rindbm34tibrtqcgvpsd.png`
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
    </aside>
  );
}

export default UserInfo;

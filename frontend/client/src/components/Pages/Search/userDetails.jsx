import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import UserPhoto from "../../userPhoto";
import { Link } from "react-router-dom";
import axios from "axios";

function userDetails({ user }) {
  const PA = import.meta.env.VITE_PUBLIC_API;
  const { dispatch, user: currentUser } = useContext(UserContext);
  const [followed, setFollowed] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  console.log(user.username);

  useEffect(() => {
    if (user._id) {
      const normalizedFollowings = currentUser.followings.map((id) =>
        id.toString()
      );
      const isFollowed = normalizedFollowings.includes(user._id.toString());
      setFollowed(isFollowed);
    }
  }, [currentUser.followings, user._id]);

  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      if (followed) {
        const res = await axios.put(
          `/api/users/${user._id}/unfollow`,
          {
            userId: currentUser._id,
          }
        );
        // console.log(res.data);
        if (res.data) {
          dispatch({ type: "UNFOLLOW", payload: user._id });
        }
      } else {
        const res = await axios.put(
          `/api/users/${user._id}/follow`,
          {
            userId: currentUser._id,
          }
        );
        if (res.data) {
          dispatch({ type: "FOLLOW", payload: user._id });
        }
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <div
      key={user._id}
      className=""
    >
      {/* User Photo and Info */}
      <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:gap-4">
        {/* User Photo */}
        <div className="flex justify-center sm:justify-start mb-4 sm:mb-0">
          <Link to={`/profile/${user._id}`}>
            <UserPhoto
              userId={user._id}
              user={user}
              className="w-20 h-20 rounded-full border border-gray-300"
            />
          </Link>
        </div>

        {/* User Info */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-lg font-semibold text-gray-800">
            {user.username}
          </h1>
          <p className="text-sm text-gray-600 mt-1 truncate">
            {user.bio || "No bio available"}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-gray-200 gap-2 sm:gap-4">
        {user._id === currentUser._id ? null : (
          <button
            onClick={handleFollow}
            className={`flex items-center justify-center gap-2 text-sm px-4 py-2 rounded-md w-full sm:w-auto ${
              followed
                ? "bg-gray-200 text-gray-600 hover:bg-gray-300"
                : "bg-blue-500 text-white hover:bg-blue-600"
            } transition-all duration-200`}
          >
            <i
              className={`ri-user-${
                followed ? "unfollow" : "follow"
              }-line text-lg`}
            ></i>
            {followed ? "Unfollow" : "Follow"}
          </button>
        )}

        <Link
          to={`/profile/${user._id}`}
          className="text-sm font-semibold text-blue-500 border border-blue-500 rounded-md py-2 px-4 hover:bg-blue-500 hover:text-white transition-all duration-200 w-full sm:w-auto"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
export default userDetails;

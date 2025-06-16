import { followUser, isUserFollowed } from "../../../../apiCalls";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import { FaUserPlus, FaUserMinus } from "react-icons/fa";

function followButton({ otherUser, text, icon }) {
  const { user: currentUser, dispatch } = useContext(UserContext);
  const [followLoading, setFollowLoading] = useState(false);
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    if (otherUser._id) {
      setFollowed(isUserFollowed(currentUser, otherUser));
    }
    // console.log(isUserFollowed(currentUser, otherUser));
  }, [currentUser?.followings, otherUser?._id]);

  const handleFollow = async () => {
    try {
      setFollowLoading(true);
      if ((currentUser, otherUser))
        await followUser(dispatch, currentUser, otherUser, followed);
      setFollowLoading(false);
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  const isTextLong = text.length > 6;

  return (
    <>
      <button
        onClick={handleFollow}
        className={`flex items-center ${
          text.length > 6 ? "text-sm" : "text-lg"
        } justify-center gap-2 text-sm px-4 py-2 rounded-md w-full sm:w-auto ${
          followed
            ? "bg-gray-200 text-gray-600 hover:bg-gray-300"
            : "bg-blue-500 text-white hover:bg-blue-600"
        } transition-all duration-200`}
        disabled={followLoading} // Disable button during loading
      >
        {/* Loading Spinner */}
        {followLoading && (
          <div
            className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${
              followed ? "border-gray-600" : "border-white"
            }`}
          ></div>
        )}

        {/* Icon */}
        {icon &&
          !followLoading &&
          (followed ? (
            <FaUserMinus className={`h-4 w-4 text-gray-600`} />
          ) : (
            <FaUserPlus className={`h-4 w-4 text-white`} />
          ))}
        <span className="truncate max-w-[100px] block">
          {!followed ? text : "Unfollow"}
        </span>
      </button>
    </>
  );
}
export default followButton;

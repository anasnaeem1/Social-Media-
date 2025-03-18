import { useContext, useEffect, useState } from "react";
import { UserContext } from "./context/UserContext";
import { useNavigate } from "react-router-dom";

function UserPhoto({ lg, userId, user, onlineUsers }) {
  const { user: currentUser } = useContext(UserContext);
  const [followed, setFollowed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user._id && Array.isArray(currentUser.followings)) {
      const isFollowed = currentUser.followings.some(
        (id) => id.toString() === user._id.toString()
      );
      setFollowed(isFollowed);
    }
  }, [currentUser.followings, user]);

  return (
    <div
      onClick={() => navigate(`/profile/${userId}`)}
      className="relative inline-block cursor-pointer"
    >
      <img
        src={
          user.profilePic
            ? user.profilePic
            : "https://res.cloudinary.com/datcr1zua/image/upload/v1739709690/uploads/rindbm34tibrtqcgvpsd.png"
        }
        alt="User Avatar"
        className={`${lg ? "w-12 h-12 sm:w-[65px] sm:h-[65px]" : "w-12 h-12 sm:w-[50px] sm:h-[50px]" } rounded-full border-2 border-white object-cover cursor-pointer`}
      />
      {userId !== currentUser._id && (
        <svg
          className="absolute top-0 left-0 w-full h-full transform rotate-90"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 160 160"
        >
          <defs>
            <linearGradient id="GradientColor">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
          <circle
            className={`fill-none stroke-[6px] ${
              !followed ? "loading-end" : "loading-start"
            }`}
            cx="80"
            cy="80"
            r="75"
            strokeLinecap="round"
            stroke="url(#GradientColor)"
            strokeDasharray="472"
            strokeDashoffset="472"
          />
        </svg>
      )}
      {onlineUsers?.some((userObj) => userObj.userId === user._id) && (
        <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
      )}
    </div>
  );
}

export default UserPhoto;

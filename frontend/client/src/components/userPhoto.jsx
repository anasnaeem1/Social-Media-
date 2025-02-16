import { useContext, useEffect, useState } from "react";
import { UserContext } from "./context/UserContext";
import { Link, useLocation } from "react-router-dom";

function UserPhoto({ userId, user, onlineUsers }) {
  const { user: currentUser } = useContext(UserContext);
  const [followed, setFollowed] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const location = useLocation();
  

  useEffect(() => {
    setImageSrc(user?.profilePic ? `${user.profilePic}?v=${Date.now()}` : "/images/noAvatar.png");
  }, [user?.profilePic, location.pathname]); // Reset when user pic or route changes

  useEffect(() => {
    if (user._id && Array.isArray(currentUser.followings)) {
      const isFollowed = currentUser.followings.some((id) => id.toString() === user._id.toString());
      setFollowed(isFollowed);
    }
  }, [currentUser.followings, user]);


  return (
    <div className="flex flex-col justify-start items-center relative">
      <Link to={`/profile/${userId}`}>
        <div className="relative w-[58px] h-[58px] border-[3px] border-white rounded-full overflow-hidden">
          <img
            src={user.profilePic}
            alt="User Avatar"
            className="w-full h-full object-cover"
          />

          {userId !== currentUser._id && (
            <svg
              className="absolute top-0 left-0 w-full h-full transform rotate-[90deg]"
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
        </div>
      </Link>
      {onlineUsers?.some((userObj) => userObj.userId === user._id) && (
        <div className="absolute bottom-1 right-[-4px] h-5 w-5 border-[3px] border-white bg-green-400 rounded-full"></div>
      )}
    </div>
  );
}

export default UserPhoto;

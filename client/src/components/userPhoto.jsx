import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import { Link } from "react-router-dom";

function userPhoto({ userId, user }) {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    if (user._id && Array.isArray(currentUser.followings)) {
      const normalizedFollowings = currentUser.followings.map((id) =>
        id.toString()
      );
      const isFollowed = normalizedFollowings.includes(user._id.toString());
      setFollowed(isFollowed);
    }
  }, [currentUser.followings, user]);

  return (
    <div className="flex flex-col justify-start items-center">
      <Link to={`/profile/${userId}`}>
        <div
          className="relative w-[58px] h-[58px] border-[3px] border-white rounded-full"
          style={{
            backgroundImage: `url(${
              user.profilePic
                ? PF + "/" + user.profilePic
                : PF + "/noAvatar.png"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {userId !== currentUser._id && (
            <svg
              className="w-[55px] h-[55px] rounded-full transform -translate-y-[1px] -translate-x-[1px] rotate-[90deg]"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              viewBox="0 0 160 160"
            >
              <defs>
                <linearGradient id="GradientColor">
                  <stop offset="0%" stopColor="#3b82f6" /> {/* Lighter Blue */}
                  <stop offset="100%" stopColor="#2563eb" /> {/* Darker Blue */}
                </linearGradient>
              </defs>

              <circle
                className={`fill-none stroke-[6px] ${
                  !followed ? "loading-end" : "loading-start"
                }`} // Increased stroke width for visibility
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
    </div>
  );
}
export default userPhoto;

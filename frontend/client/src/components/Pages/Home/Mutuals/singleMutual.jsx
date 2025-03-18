import { Link } from "react-router-dom";
import UserPhoto from "../../../userPhoto";
import { followUser, isUserFollowed } from "../../../../apiCalls";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import FollowButton from "../Buttons/followButton";

function signleMutual({ friend }) {
  const { user: currentUser , dispatch } = useContext(UserContext);
  const [followLoading, setFollowLoading] = useState(false);
  const [followed, setFollowed] = useState(false);


  return (
    <div
      key={friend._id}
      className="flex items-center max-w-[800px] justify-between py-3 px-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200"
    >
      {/* User Info */}
      <div className="flex items-center gap-4">
        <UserPhoto
          userId={friend._id}
          user={friend}
          className="w-12 h-12 rounded-full border border-gray-300"
        />
        <Link to={`/profile/${friend._id}`} className="text-left">
          <p
            className={`${
              Array.isArray(friend.fulname).length > 7 ? "text-sm" : "text-lg"
            } font-medium text-sm text-gray-800 hover:underline cursor-pointer`}
          >
            {friend.fullname}
          </p>
          <p className="text-sm text-blue-500 hover:text-blue-700 cursor-pointer">
            View Profile
          </p>
        </Link>
      </div>

      {/* Follow/Unfollow Button */}
    <FollowButton otherUser={friend} text="Follow" />
    </div>
  );
}
export default signleMutual;

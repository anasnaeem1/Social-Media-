import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import { Link } from "react-router-dom";
import UserPhoto from "../../../userPhoto";
// import UsersListSkeleton from "./userListSkeleton";
import FollowButton from "../Buttons/followButton";

function singleUser({ isFriendsListPage, isFriendsRequestPage, user }) {
  const { user: currentUser } = useContext(UserContext);
  const [mutualFriends, setMutualFriends] = useState([]);
  const [mutualFriendsLoading, setMutualFriendsLoading] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const deleteRes = await axios.delete(
        `/api/followReq/deleteReq/${user._id}`
      );
      if (deleteRes.data) {
        console.log(deleteRes.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchFriends = async () => {
      if (isFriendsListPage) {
        try {
          setMutualFriendsLoading(true);
          const mutualRes = await axios.get(
            `/api/users/userMutuals?userId=${user._id}&currentUserId=${currentUser._id}`
          );
          console.log(mutualRes.data);
          setMutualFriends(mutualRes.data);
          setMutualFriendsLoading(false);
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
      }
    };
    fetchFriends();
  }, [currentUser]);

  return (
    <div
    key={user?._id}
    className="bg-white border border-gray-200 rounded-xl w-full px-4 py-4 shadow-sm hover:shadow-md transition-shadow duration-200 relative flex items-center gap-4"
  >
    {/* User Photo */}
    <UserPhoto lg={true} userId={user?._id} user={user} />
  
    {/* User Info and Buttons */}
    <div className="flex flex-col gap-2 flex-1">
      {/* Full Name */}
      <Link to={`/profile/${user?._id}`}>
        <p className="cursor-pointer text-gray-800 text-[15px] font-semibold hover:text-blue-600 transition-colors duration-200">
          {user?.fullname}
        </p>
      </Link>
  
      {/* Mutual Friends (only on friends list page) */}
      {isFriendsListPage && !mutualFriendsLoading && mutualFriends.length > 0 && (
        <p className="text-xs text-gray-500">
          {mutualFriends.length} mutual friend{mutualFriends.length > 1 && 's'}
        </p>
      )}
  
      {/* Buttons (only on friend requests page) */}
      {isFriendsRequestPage && (
        <div className="flex gap-3 mt-1">
          <FollowButton otherUser={user} text="Follow back" />
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md px-2 py-1 hover:bg-gray-200 hover:border-gray-400 transition-all"
          >
            <i className="ri-delete-bin-line text-base"></i>
            Delete
          </button>
        </div>
      )}
    </div>
  
    {/* Options Icon (3 dots) - only on friends list */}
    {isFriendsListPage && (
      <div className="absolute right-3 top-3 rounded-full p-2 hover:bg-gray-100 cursor-pointer transition-all duration-200">
        <i className="text-gray-600 ri-more-line text-lg"></i>
      </div>
    )}
  </div>
  
  );
}

export default singleUser;

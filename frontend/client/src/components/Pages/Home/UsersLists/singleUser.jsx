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
      className="bg-gray-50 rounded-xl w-full px-2 py-2 relative flex items-center gap-4"
    >
      {/* User Photo */}
      <UserPhoto lg={true} userId={user?._id} user={user} />
      {/* User Info and Buttons */}
      <div className="flex flex-col gap-3 flex-1">
        {/* Full Name */}
        <Link to={`/profile/${user?._id}`}>
          <p className="cursor-pointer text-gray-800 text-base font-semibold hover:text-blue-500 transition-all duration-200">
            {user?.fullname}
          </p>
        </Link>

        {isFriendsListPage && (
          <div>
            {!mutualFriendsLoading && mutualFriends.length > 0 ? (
              <h1 className="text-xs text-gray-800">
                {mutualFriends.length} {""}
                mutual friends
              </h1>
            ) : (
              ""
              // <div className="h-3 w-2"></div>
            )}
          </div>
        )}

        {/* Buttons */}
        {isFriendsRequestPage && (
          <div className="flex gap-3">
            {/* Follow Back Button */}
            <FollowButton otherUser={user} text="Follow back" />
            <button
              onClick={handleDelete}
              className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-md px-4 py-1 hover:bg-gray-200 hover:border-gray-400 transition-all duration-200"
            >
              <i className="ri-delete-bin-line text-lg"></i>
              Delete
            </button>
          </div>
        )}
      </div>
      {isFriendsListPage && (
        <div className="flex items-center justify-center rounded-full absolute w-8 h-8 cursor-pointer transition-all duration-300 hover:bg-gray-100 right-0 top-4">
          <i className="text-lg text-black ri-more-line"></i>
        </div>
      )}
    </div>
  );
}

export default singleUser;

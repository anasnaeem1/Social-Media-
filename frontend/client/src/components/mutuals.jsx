import { useContext, useEffect, useState } from "react";
import { UserContext } from "./context/UserContext";
import axios from "axios";
import UserPhoto from "./userPhoto";
import { Link } from "react-router-dom";

function FollowSuggestion() {
  const { user, dispatch } = useContext(UserContext);
  const [mutualFriends, setMutualFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const PA = import.meta.env.VITE_PUBLIC_API;

  useEffect(() => {
    if (user._id) {
      const fetchFriends = async () => {
        try {
          const res = await axios.get(`/api/users/mutuals?userId=${user._id}`);
          if (res.data) {
            const sanitizedResponse = res.data.filter(
              (e) => e._id !== user._id
            );
            const friendsWithFollowState = sanitizedResponse.map((friend) => ({
              ...friend,
              isFollowed: user.followings.includes(friend._id),
            }));
            setMutualFriends(friendsWithFollowState);
          }
          setLoadingFriends(false);
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
      };
      fetchFriends();
    }
  }, [user]);

  const handleFollowToggle = async (friendId, isCurrentlyFollowed) => {
    try {
      if (isCurrentlyFollowed) {
        await axios.put(`/api/users/${friendId}/unfollow`, {
          userId: user._id,
        });
        dispatch({ type: "UNFOLLOW", payload: friendId });
      } else {
        await axios.put(`/api/users/${friendId}/follow`, {
          userId: user._id,
        });
        dispatch({ type: "FOLLOW", payload: friendId });
      }

      // Update follow state locally
      setMutualFriends((prevFriends) =>
        prevFriends.map((friend) =>
          friend._id === friendId
            ? { ...friend, isFollowed: !isCurrentlyFollowed }
            : friend
        )
      );
    } catch (error) {
      console.error("Error toggling follow state:", error);
    }
  };

  return (
    <div className="w-full max-w-lg  bg-gray-50 rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mutual Friends</h1>

      <ul className="flex flex-col gap-4">
        {loadingFriends ? (
          <p className="text-center text-gray-600">Loading Friends...</p>
        ) : mutualFriends.length > 0 ? (
          mutualFriends.map((friend) => (
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
                      Array.isArray(friend.username).length > 7 ? "text-sm" : "text-lg"
                    } font-medium text-sm text-gray-800 hover:underline cursor-pointer`}
                  >
                    {friend.username}
                  </p>
                  <p className="text-sm text-blue-500 hover:text-blue-700 cursor-pointer">
                    View Profile
                  </p>
                </Link>
              </div>

              {/* Follow/Unfollow Button */}
              <button
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  friend.isFollowed
                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                onClick={() =>
                  handleFollowToggle(friend._id, friend.isFollowed)
                }
              >
                {friend.isFollowed ? "Unfollow" : "Follow"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No mutual friends found</p>
        )}
      </ul>
    </div>
  );
}

export default FollowSuggestion;

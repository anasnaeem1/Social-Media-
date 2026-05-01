import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import UserPhoto from "../../userPhoto";
import FollowButton from "../Buttons/followButton";

function SingleUser({ isFriendsListPage, isFriendsRequestPage, user }) {
  const { user: currentUser } = useContext(UserContext);
  const [mutualFriends, setMutualFriends] = useState([]);
  const [mutualFriendsLoading, setMutualFriendsLoading] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await axios.delete(`/api/followReq/deleteReq/${user._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchFriends = async () => {
      if (!isFriendsListPage || !currentUser?._id || !user?._id) return;
      try {
        setMutualFriendsLoading(true);
        const mutualRes = await axios.get(
          `/api/users/userMutuals?userId=${user._id}&currentUserId=${currentUser._id}`
        );
        setMutualFriends(mutualRes.data ?? []);
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setMutualFriendsLoading(false);
      }
    };
    fetchFriends();
  }, [currentUser?._id, isFriendsListPage, user?._id]);

  return (
    <div className="relative w-full min-w-0 overflow-hidden rounded-xl bg-white/80 px-3 py-3 transition-colors duration-200 hover:bg-white">
      <div className="flex min-w-0 items-start gap-3">
        <div className="shrink-0 pt-0.5">
          <UserPhoto userId={user?._id} user={user} />
        </div>

        <div
          className={`min-w-0 flex-1 overflow-hidden ${isFriendsListPage ? "pr-9" : ""}`}
        >
          <Link to={`/profile/${user?._id}`} className="block min-w-0">
            <p
              title={user?.fullname}
              className="truncate text-[15px] font-semibold text-gray-800 transition-colors duration-200 hover:text-blue-600"
            >
              {user?.fullname}
            </p>
          </Link>

          {isFriendsListPage &&
            !mutualFriendsLoading &&
            mutualFriends.length > 0 && (
              <p className="mt-1 text-xs text-gray-500">
                {mutualFriends.length} mutual friend
                {mutualFriends.length > 1 ? "s" : ""}
              </p>
            )}

          {/* Stacked actions: avoids horizontal overflow in narrow sidebar */}
          {isFriendsRequestPage && (
            <div className="mt-2 flex w-full min-w-0 flex-col gap-2">
              <FollowButton fullWidth otherUser={user} text="Follow back" />
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex min-h-[40px] w-full min-w-0 shrink items-center justify-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
              >
                <i className="ri-delete-bin-line shrink-0 text-base" aria-hidden />
                <span className="truncate">Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {isFriendsListPage && (
        <div
          className="absolute right-2 top-2 shrink-0 rounded-full p-2 transition-all hover:bg-gray-100"
          role="presentation"
          aria-hidden
        >
          <i className="ri-more-line text-lg text-gray-600" />
        </div>
      )}
    </div>
  );
}

export default SingleUser;

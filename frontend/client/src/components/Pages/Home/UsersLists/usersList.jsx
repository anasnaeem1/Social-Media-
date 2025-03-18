import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import UserPhoto from "../../../userPhoto";
import { getUserFriends } from "../../../../apiCalls";
import UsersListSkeleton from "./userListSkeleton";
import SingleUser from "./singleUser";

function userList({ isFriendsListPage, isFriendsRequestPage }) {
  const { user: currentUser } = useContext(UserContext);
  const [userList, setuserList] = useState([]);
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser._id) {
      const fetchFriends = async () => {
        try {
          const usersRes = isFriendsRequestPage
            ? await axios.get(
                `/api/followReq/allRequestsUsers/${currentUser._id}`
              )
            : isFriendsListPage && (await getUserFriends(currentUser._id));
          const users = isFriendsListPage
            ? usersRes
            : isFriendsRequestPage && usersRes.data;
          setuserList(users);
          console.log(users);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
      };
      fetchFriends();
    }
  }, [currentUser]);

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const deleteRes = await axios.get(
        `/api/followReq/deleteReq/${currentUser._id}`
      );
      if (deleteRes.data) {
        console.log(deleteRes.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <ul className="flex justify-center items-start flex-col gap-3">
        {isLoading ? (
          <>
            <UsersListSkeleton
              key="skeleton-1"
              isFriendsListPage={isFriendsListPage}
              isFriendsRequestPage={isFriendsRequestPage}
            />
            <UsersListSkeleton
              key="skeleton-2"
              isFriendsListPage={isFriendsListPage}
              isFriendsRequestPage={isFriendsRequestPage}
            />
          </>
        ) : Array.isArray(userList) && userList.length > 0 ? (
          userList.map((user) => (
            <SingleUser
              key={user._id} // Add a unique key for each user
              isFriendsListPage={isFriendsListPage}
              isFriendsRequestPage={isFriendsRequestPage}
              user={user}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center w-full px-2 py-8 text-center">
            {/* Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-20 h-20 text-gray-400 mb-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>

            {/* Message */}
            <p className="text-gray-700 text-xl font-semibold mb-3">
              No {isFriendsRequestPage ? "Friend Requests" : "friends"} Found
            </p>
            <p className="text-gray-500 text-sm max-w-md mb-6">
              It looks like you don't have any{" "}
              {isFriendsRequestPage ? "Friend Requests" : "friends"} at the
              moment. Start connecting with others to expand your network!
            </p>

            {/* Call-to-Action Button */}
            <button
              onClick={() => {
                // Add your explore friends logic here
              navigate("/friends")
              }}
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Explore Friends
            </button>
          </div>
        )}
      </ul>
    </div>
  );
}

export default userList;

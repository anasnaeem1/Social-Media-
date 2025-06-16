import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import { getAllUsers, getBirthdayFriends } from "../../../../../apiCalls";
import UserPhoto from "../../../../userPhoto";
import { Link, useNavigate } from "react-router-dom";
import BirthdayUser from "./birthdayUser";
import BirthdayUserSkeleton from "./birthdayUserSkeleton";

function UsersBirthdaysPage() {
  const {
    user: currentUser,
    dispatch,
    birthdayFriends: friends,
  } = useContext(UserContext);
  const [birthdayFriends, setBirthdayFriends] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const Navigate = useNavigate();

  useEffect(() => {
    if (currentUser._id) {
      const fetchFriends = async () => {
        try {
          if (friends.length > 0) {
            setBirthdayFriends(friends);
            return;
          } else {
            const birthdayFriendsRes = await getBirthdayFriends(
              currentUser?._id
            );
            if (birthdayFriendsRes && Array.isArray(birthdayFriendsRes)) {
              const shuffledFriends = birthdayFriendsRes.sort(
                () => Math.random() - 0.5
              );
              setBirthdayFriends(shuffledFriends);
              dispatch({
                type: "UPDATEBIRTHDAYFRIENDS",
                payload: shuffledFriends,
              });
            }
            console.log("birthday Friends Are", birthdayFriendsRes);
          }
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
      };

      fetchFriends();
    }
  }, [currentUser]);

  return (
    <div
      className={`${
        birthdayFriends.length > 2 ? "justify-start" : "justify-center"
      } max-w-[600px] w-full py-2 flex gap-2 flex-col items-center `}
    >
      <div className="relative flex w-full rounded-lg p-3 items-center justify-between">
        {/* Back Button */}
        <div
          onClick={() => Navigate(-1)}
          className="flex justify-center items-center h-10 w-10 bg-gray-100 rounded-full hover:bg-gray-200 transition duration-300 cursor-pointer group"
        >
          <i className="ri-arrow-left-line text-xl text-gray-600 group-hover:text-gray-800 transition duration-300"></i>
        </div>

        {/* Friends Heading */}
        <div className={`justify-center w-full flex-1 flex items-center relative`}>
          {/* "Friends" Heading */}
          <h1 className={`font-semibold transition-all duration-300`}>
            Birthdays Today
          </h1>
        </div>

        <div className="flex justify-center items-center h-10 w-10 bg-gray-100 rounded-full hover:bg-gray-200 transition duration-300 cursor-pointer group">
          <i className="ri-settings-2-fill text-xl text-gray-600 group-hover:text-gray-800 transition duration-300"></i>
        </div>
      </div>
      {usersLoading ? (
        <>
          <BirthdayUserSkeleton />
          <BirthdayUserSkeleton />
          <BirthdayUserSkeleton />
          <BirthdayUserSkeleton />
        </>
      ) : birthdayFriends.length > 0 ? (
        birthdayFriends.map((friend) => (
          <BirthdayUser key={friend._id} friend={friend} />
        ))
      ) : (
        <div className="p-4 text-center">
          <p className="text-gray-600">No birthdays today. 🎉</p>
          <p className="text-sm text-gray-500">
            Check back later to celebrate with your friends!
          </p>
        </div>
      )}
    </div>
  );
}

export default UsersBirthdaysPage;

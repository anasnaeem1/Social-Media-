import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import { getAllUsers, getBirthdayFriends } from "../../../../../apiCalls";
import UserPhoto from "../../../../userPhoto";
import { Link } from "react-router-dom";
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
    <div className={`${birthdayFriends.length > 2 ? "justify-start" : "justify-center"} max-w-[600px] w-full py-2 flex gap-2 flex-col items-center `}>
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

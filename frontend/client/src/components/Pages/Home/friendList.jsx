import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import { Link } from "react-router-dom";
import UserPhoto from "../../userPhoto";

function FriendList() {
  const { user } = useContext(UserContext);
  const [friendList, setFriendList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const PF = import.meta.env.VITE_PUBLIC_FOLDER || "";
  const PA = import.meta.env.VITE_PUBLIC_API;

  useEffect(() => {
    if (user._id) {
      const fetchFriends = async () => {
        try {
          const res = await axios.get(`/api/users/friends/${user._id}`);
          setFriendList(res.data);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
      };
      fetchFriends();
    }
  }, [user]);

  return (
    <div>
      <ul className="flex justify-center items-start flex-col gap-3">
        {isLoading ? (
          <p>Loading Friends...</p>
        ) : friendList.length > 0 ? (
          friendList.map((friend) => (
            <div key={friend._id} className="flex items-center gap-4">
              <UserPhoto userId={friend._id} user={friend} />
              <Link to={`/profile/${friend._id}`}>
                <div>
                  <p className="cursor-pointer text-black text-lg">{friend.username}</p>
                  <span href="#" className="cursor-pointer text-blue-500">
                    View Profile
                  </span>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>No friends found</p>
        )}
      </ul>
    </div>
  );
}

export default FriendList;

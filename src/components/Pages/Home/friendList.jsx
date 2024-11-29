import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function friendList() {
  const { user } = useContext(AuthContext);
  const [friendList, setFriendList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const PA = import.meta.env.VITE_PUBLIC_API;

  useEffect(() => {
    if (user._id) {
      const fetchFriends = async () => {
        try {
          const res = await axios.get(`${PA}/api/users/friends/${user._id}`);
          setFriendList(res.data);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
      };
      fetchFriends();
    }
  }, [user]);

  // console.log(friendList);
  return (
    <div>
      <ul className="flex justify-center items-start flex-col gap-3">
        {isLoading ? (
          <p>loading Friends...</p>
        ) : friendList.length > 0 ? (
          friendList.map((Friend) => (
            <Link
              to={`/profile/${Friend._id}`}
              key={Friend.id}
              className="flex items-center gap-4"
            >
              <img
                src={
                  Friend.profilePic
                    ? `${PF}/Person/${Friend.profilePic}`
                    : `${PF}/Person/noAvatar.jpg`
                }
                alt={`${Friend.fname} ${Friend.lname}`}
                className="w-[50px] h-[50px] rounded-full"
              />
              <div>
                <p className="cursor-pointer text-black text-lg">{`${Friend.username}`}</p>
                <a href="#" className="cursor-pointer text-blue-500">
                  View Profile
                </a>
              </div>
            </Link>
          ))
        ) : (
          <p>no friends found</p>
        )}
      </ul>
    </div>
  );
}

export default friendList;

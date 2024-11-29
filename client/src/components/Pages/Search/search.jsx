// import { useContext } from "react";
// import { AuthContext } from "../../context/AuthContext";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Search() {
  // const { SearchedUser } = useContext(AuthContext);
  // const { username } = useParams();
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const PA = import.meta.env.VITE_PUBLIC_API;
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  const userId = useParams().id;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${PA}/api/users?userId=${userId}`);
        setUser(res.data);
        setIsLoading(false);
      } catch (error) {
        console.log("Error at fetching", error);
      }
    };
    fetchUser();
  }, [userId]);

  return (
    <div className="h-[90vh] flex justify-start flex-col items-center py-7">
      <div className="w-[500px] bg-white">
        <div className="bg-white mx-2 shadow-[0px_0px_22px_-13px_rgba(0,0,0,0.84)] border border-gray-200 rounded-2xl flex flex-col gap-2 max-w-[540px] w-full">
          {/* Post Header */}
          <div className="flex px-3 py-3 justify-between items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-[3rem] h-[3rem] rounded-full">
                <Link to={`/profile/${user._id}`}>
                  <img
                    src={`${
                      user.profilePic
                        ? PF + "Person/" + user.profilePic
                        : PF + "Person/noAvatar.jpg"
                    }`}
                    alt={user.username}
                    className="w-[3rem] h-[3rem] rounded-full"
                  />
                </Link>
              </div>

              <div className="flex flex-col">
                <h1 className="cursor-pointer text-lg">{user.username}</h1>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="cursor-pointer flex justify-center items-center hover:bg-gray-200 w-10 h-10 rounded-full text-xl">
                <i className="ri-more-line"></i>
              </div>
              <div className="cursor-pointer flex justify-center items-center hover:bg-gray-200 w-10 h-10 rounded-full text-xl">
                <i className="ri-close-line"></i>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="flex justify-start">
            <p className="px-2 text-md font-medium ml-2 text-gray-800">
              {user.bio}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

}

export default Search;

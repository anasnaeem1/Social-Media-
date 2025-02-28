import { Link, useLocation } from "react-router-dom";
import FriendList from "../Home/friendList";
import UserPhoto from "../../userPhoto";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

function Options({ mainItems, SeperatingLine, userId }) {
  const { Options } = mainItems;
  const { user } = useContext(UserContext);
  const location = useLocation();
  const isFriendsPage = location.pathname.startsWith("/friends");

  return (
    <>
      <div
        className={`${
          userId
            ? "hidden lg:block w-[250px]"
            : "hidden md:block lg:w-[300px] w-[250px]"
        }  border-green-600`}
        style={{ height: "calc(100vh - 65px)" }}
      ></div>

      {/* Main Options Container */}
      <div
        className={`fixed border-blue-600 left-0 top-[65px] w-full max-w-[250px] custom-scrollbar overflow-y-scroll ${
          userId
            ? "hidden lg:block lg:max-w-[250px]"
            : "hidden md:block options-container lg:max-w-[300px]"
        }`}
        style={{ height: "calc(100vh - 65px)" }}
      >
        <div className=" w-full pt-5 flex flex-col gap-6">
          {/* Options List */}

          {false && (
            <ul className="flex flex-col gap-5 ">
              {Options.map((option, id) => (
                <Link
                  to={option.link}
                  key={id}
                  className="flex items-center gap-4 group"
                >
                  <li
                    className="relative text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-sky-400 to-green-300 
                  text-2xl group-hover:from-green-300 group-hover:via-sky-400 group-hover:to-blue-500 transition duration-300"
                    style={{ WebkitTextFillColor: "transparent" }}
                  >
                    {option.icon}
                  </li>
                  <span className="text-gray-700 text-lg group-hover:text-blue-500 transition duration-300">
                    {option.label}
                  </span>
                </Link>
              ))}
              <button className="py-2 px-8 bg-gray-200 text-sm border border-gray-300 rounded-lg hover:bg-gray-300 hover:border-gray-400 transition duration-300">
                Show More
              </button>
            </ul>
          )}

          <div className="w-full flex flex-col gap-4 pl-3">
            {/* User Info Section */}
            <Link
              to={`/profile/${user._id}`}
              className="flex rounded-lg py-2 px-2 transition-all ease-in-out duration-100 hover:bg-gray-100 items-center justify-start hover:cursor-pointer gap-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 border border-gray-50 hover:border hover:border-blue-200"
            >
              <UserPhoto userId={user._id} user={user} />
              <h1 className="font-semibold text-lg text-blue-900">
                {user.fullname}
              </h1>
            </Link>

            {/* Icons Section */}
            <div className="flex flex-col gap-2">
              {Array.isArray(user?.followers) &&
                user?.followers?.length > 0 && (
                  <Link
                    to={"/friends"}
                    className="flex rounded-lg p-3 transition-all duration-300 hover:bg-gray-100 items-center justify-start cursor-pointer gap-3"
                  >
                    <div className="flex justify-center items-center h-10 w-10 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100">
                      <i className="text-xl ri-group-fill text-blue-500"></i>
                    </div>
                    <h1 className="font-medium text-gray-700">
                      {user.followers.length} followers
                    </h1>
                  </Link>
                )}

              <div className="flex rounded-lg p-3 transition-all duration-300 hover:bg-gray-100 items-center justify-start cursor-pointer gap-3">
                <div className="flex justify-center items-center h-10 w-10 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100">
                  <i className="text-xl ri-bookmark-fill text-blue-500"></i>
                </div>
                <h1 className="font-medium text-gray-700">Saved</h1>
              </div>

              <Link
                to={!userId && !isFriendsPage ? `/profile/${user._id}` : "/"}
                className="flex rounded-lg p-3 transition-all duration-300 hover:bg-gray-100 items-center justify-start cursor-pointer gap-3"
              >
                <div className="flex justify-center items-center h-10 w-10 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100">
                  <i
                    className={`text-xl ${
                      userId ? "ri-rss-fill" : "ri-user-fill"
                    }  text-blue-500`}
                  ></i>
                </div>
                <h1 className="font-medium text-gray-700">
                  {!userId && !isFriendsPage ? "Profile" : "Feed"}
                </h1>
              </Link>

              <div className="flex rounded-lg p-3 transition-all duration-300 hover:bg-gray-100 items-center justify-start cursor-pointer gap-3">
                <div className="flex justify-center items-center h-10 w-10 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100">
                  <i className="text-xl ri-cake-2-fill text-blue-500"></i>
                </div>
                <h1 className="font-medium text-gray-700">Birthdays</h1>
              </div>
            </div>
          </div>

          {/* Separator */}
          {/* <SeperatingLine color={"border-gray-300"} /> */}

          {/* Friend List */}
          {/* <FriendList /> */}
        </div>
      </div>
    </>
  );
}

export default Options;

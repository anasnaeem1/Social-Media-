import { navItems } from "../../constants/index.jsx";
import UserPhoto from "../currentUserPhoto.jsx";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../logo.jsx";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { Logout } from "../context/AuthActions.js";
import CurrentUserPhoto from "../currentUserPhoto.jsx";
import { searchUser } from "../../apiCalls.js";
import { useParams } from "react-router-dom";

function Navbar() {
  const { controlsIcons } = navItems;
  const { reload, isOverlayVisible, dispatch, SearchedUser, user } =
    useContext(AuthContext);
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const searchedUsername = useRef();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const [isMenuClicked, setIsMenuClicked] = useState(false);

  const handleMenuClick = () => {
    setIsMenuClicked(true);
    setTimeout(() => setIsMenuClicked(false), 200); // Reset the state after 0.3 seconds
  };

  const handleGetOut = () => {
    dispatch(Logout());
    navigate("/login");
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    const username = searchedUsername.current.value;
    if (username) {
      try {
        await searchUser(username, dispatch);
      } catch (err) {
        console.log("Error during search", err);
      }
    } else {
      console.log("Search input is not available");
    }
  };

  const handleClearInput = () => {
    searchedUsername.current.value = "";
  };

  useEffect(() => {
    if (SearchedUser && SearchedUser[0] && SearchedUser[0].username) {
      const username = searchedUsername.current.value;
      if (SearchedUser[0].username === username) {
        navigate(`/search/${SearchedUser[0].id}`);
        searchedUsername.current.value = "";
      }
    }
  }, [SearchedUser]);

  const handleReload = () => {
    dispatch({ type: "RELOAD", payload: true });
  };

  const handleMenu = (e) => {
    e.preventDefault();
    setIsMenuVisible((prev) => !prev);
  };

  return (
    <>
      <div className={`${params === "/photo" ? "hidden" : "block"} w-full h-[65px]`}></div>
      {isOverlayVisible && (
        <div className="fixed top-0 left-0 right-0 h-[65px] bg-black opacity-5 z-[9999] pointer-events-none"></div>
      )}

      {/* Navbar */}
      <header
        style={{ fontFamily: "montserrat, sans-serif" }}
        className={`border-b  fixed top-0 z-[10] text-black w-full bg-white flex justify-between items-center px-3 h-[65px]`}
      >
        <div
          onClick={() => {
            handleClearInput();
            handleReload();
          }}
        >
          <Link to="/">
            <Logo />
          </Link>
        </div>

        {/* Search Bar */}
        <div>
          <i className="flex lg:hidden items-center justify-center ri-search-line text-lg w-11 h-11 bg-BgColor text-white rounded-full"></i>
          <div className="hidden lg:flex items-center px-2 py-2">
            <form
              onSubmit={handleSearch}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch(e);
                }
              }}
              className="relative flex"
            >
              {/* Search Input */}
              <input
                ref={searchedUsername}
                type="text"
                placeholder="Search..."
                className="border-gray-300 border focus:outline-gray-400 focus:px-6 transition-all duration-300 text-black bg-transparent w-full px-3 py-2 rounded-full"
              />

              {/* Search Button */}
              <button
                type="submit"
                className="border-gray-300 border absolute right-0 top-0 bottom-0 bg-blue-500 hover:bg-blue-600 text-white rounded-r-full px-4 flex items-center justify-center"
              >
                <i className="ri-search-line text-lg"></i>
              </button>
            </form>
          </div>
        </div>

        <div className="flex gap-5 justify-center items-center">
          {/* Controls */}
          <div>
            <ul className="flex gap-2 text-lg">
              <Link
                to={user ? "/profile/" + user._id : undefined}
                className="hidden sm:flex"
              >
                <li className="text-md">Home</li>
              </Link>

              <Link to="/" className="hidden sm:flex">
                <li className="text-md">Timeline</li>
              </Link>
            </ul>
          </div>

          {/* Controls Icons */}
          <div>
            <ul className="flex gap-4 text-xl">
              {/* User Icon  */}
              <li className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-sky-400 to-green-300 text-black cursor-pointer relative text-2xl">
                <span>
                  <i className="ri-user-fill"></i>
                </span>
              </li>
              {/* Message Icon  */}
              <Link to={`/messages`}>
                <li className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-sky-400 to-green-300 text-black cursor-pointer relative text-2xl">
                  <span>
                    <i className="ri-message-2-fill"></i>
                  </span>
                  <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full transform translate-x-1/2 -translate-y-1/2">
                    3
                  </span>
                </li>
              </Link>
              {/* Notifications Icon  */}
              <li className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-sky-400 to-green-300 text-black cursor-pointer relative text-2xl">
                <span>
                  <i className="ri-notification-2-fill"></i>
                </span>
                <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full transform translate-x-1/2 -translate-y-1/2">
                  1
                </span>
              </li>
            </ul>
          </div>
          <div className="cursor-pointer flex flex-col justify-start items-center relative">
            <Link onClick={handleMenu}>
              <div
                onClick={handleMenuClick}
                className={`w-[50px] h-[50px] bg-cover bg-no-repeat rounded-full transition-all duration-300 ${
                  isMenuClicked
                    ? "scale-90 shadow-inner opacity-70"
                    : "scale-100 shadow-none opacity-100"
                }`}
                style={{
                  backgroundImage: `url(${
                    user
                      ? user.profilePic
                        ? `${PF}/${user.profilePic}`
                        : `${PF}/noAvatar.png`
                      : undefined
                  })`,
                }}
              ></div>
            </Link>
            <div className="absolute bottom-1 flex items-center justify-center right-[-4px] h-5 w-5 border-[3px] border-white bg-white rounded-full">
              <i className="text-lg text-gray-400 ri-arrow-down-s-line"></i>
            </div>
            {isMenuVisible && (
              <div className="border shadow-2xl absolute top-[61px] right-0 bg-white rounded-xl w-[350px] overflow-hidden">
                {/* User Profile */}
                <div className="flex items-center px-4 py-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <CurrentUserPhoto />
                  <span className="ml-4 text-gray-800 text-lg font-semibold">
                    {user.username}
                  </span>
                </div>
                <hr className="border-gray-200" />

                {/* Setting And Privacy */}
                <div className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors">
                  <span className="flex items-center justify-center text-white bg-gradient-to-r from-blue-500 to-blue-700 shadow-md rounded-full h-[45px] w-[45px]">
                    <i className="ri-settings-2-fill text-2xl"></i>
                  </span>
                  <span className="ml-4 text-gray-700 text-lg font-medium">
                    Setting & Privacy
                  </span>
                </div>

                {/* Help & Support */}
                <div className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors">
                  <span className="flex items-center justify-center text-white bg-gradient-to-r from-green-500 to-green-700 shadow-md rounded-full h-[45px] w-[45px]">
                    <i className="ri-question-fill text-2xl"></i>
                  </span>
                  <span className="ml-4 text-gray-700 text-lg font-medium">
                    Help & Support
                  </span>
                </div>

                {/* Display & Accessibility */}
                <div className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors">
                  <span className="flex items-center justify-center text-white bg-gradient-to-r from-purple-500 to-purple-700 shadow-md rounded-full h-[45px] w-[45px]">
                    <i className="ri-moon-fill text-2xl"></i>
                  </span>
                  <span className="ml-4 text-gray-700 text-lg font-medium">
                    Display & Accessibility
                  </span>
                </div>

                {/* Give Feedback */}
                <div className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors">
                  <span className="flex items-center justify-center text-white bg-gradient-to-r from-yellow-500 to-yellow-700 shadow-md rounded-full h-[45px] w-[45px]">
                    <i className="ri-feedback-fill text-2xl"></i>
                  </span>
                  <div className="ml-4">
                    <span className="text-gray-700 text-md font-medium">
                      Give Feedback
                    </span>
                    <span className="block text-gray-500 text-sm font-light">
                      CTRL + B
                    </span>
                  </div>
                </div>

                {/* Logout */}
                <div
                  onClick={handleGetOut}
                  className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors"
                >
                  <span className="flex items-center justify-center text-white bg-gradient-to-r from-red-500 to-red-700 shadow-md rounded-full h-[45px] w-[45px]">
                    <i className="ri-logout-box-r-fill text-2xl"></i>
                  </span>
                  <span className="ml-4 text-gray-700 text-lg font-medium">
                    Logout
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;

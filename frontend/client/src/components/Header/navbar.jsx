import { navItems } from "../../constants/index.jsx";
import UserPhoto from "../currentUserPhoto.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../logo.jsx";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../context/UserContext.jsx";
import { Logout } from "../context/UserActions.js";
import CurrentUserPhoto from "../currentUserPhoto.jsx";
// import { searchUser } from "../../apiCalls.js";
import SearchButtonsForMobile from "./SearchButtonsForMobile.jsx";
import SearchSuggestions from "../Pages/searchSuggestions/suggesionBox.jsx";
import { useParams } from "react-router-dom";

function Navbar() {
  // const { controlsIcons } = navItems;
  const { dispatch, SearchedUser, user, searchedInput, mobileSearchInput } =
    useContext(UserContext);
  const searchedUsername = useRef(null);
  const location = useLocation();
  const isPostPage = location.pathname.startsWith("/post");
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const searchInput = useRef(null);
  const { postId } = useParams();
  const [isSmScreen, setIsSmScreen] = useState(false);

  useEffect(() => {
    if (!searchedInput) {
      searchInput.current.value = "";
    } else {
      searchInput.current.value = searchedInput;
    }
  }, [searchedInput]);

  useEffect(() => {
    setIsMenuVisible(false);
  }, [location]);

  const handleInputChange = () => {
    if (searchInput.current) {
      const inputValue = searchInput.current.value || "";

      if (inputValue === "") {
        dispatch({ type: "SEARCHEDINPUT", payload: inputValue });
        return;
      }

      dispatch({ type: "SEARCHEDINPUT", payload: inputValue });
    }
  };

  const handleMenuClick = () => {
    setIsMenuClicked(true);
    setTimeout(() => setIsMenuClicked(false), 200); // Reset the state after 0.3 seconds
  };

  const handleLogOut = () => {
    dispatch(Logout());
    navigate("/login");
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    const input = searchInput.current.value;

    if (input) {
      // Replace spaces with hyphens for clarity
      const formattedInput = input.trim().replace(/\s+/g, "-");

      navigate(`/search/${formattedInput}`);
      dispatch({ type: "SEARCHEDINPUT", payload: "" });
    } else {
      console.log("Search input is not available");
    }
  };

  const handleClearInput = () => {
    dispatch({ type: "SEARCHEDINPUT", payload: "" });
    if (searchedUsername.current) {
      searchedUsername.current.value = "";
    }
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
    setIsMenuVisible(false);
    dispatch({ type: "RELOAD", payload: true });
    dispatch({ type: "UPDATELOADEDPOST", payload: [] });
  };

  // const handleMenu = (e) => {
  //   e.preventDefault();
  //   setIsMenuVisible((prev) => !prev);
  // };

  const handleUserProfile = (e) => {
    e.preventDefault();
    navigate(`/profile/${user._id}`);
    setIsMenuVisible(false);
  };

  useEffect(() => {
    const handleResize = () => {
      const isScreenWide = window.innerWidth >= 640;
      setIsSmScreen(isScreenWide);
      if (isScreenWide && dispatch) {
        dispatch({
          type: "MOBILESEARCHINPUT",
          payload: false,
        });
        dispatch({
          type: "TOGGLE_PHOTO_COMMENTS",
          payload: false,
        });
        setIsMenuVisible(false);
      }
      if (isScreenWide && searchedInput) {
        setIsMenuVisible(false);
        dispatch({
          type: "MOBILESEARCHINPUT",
          payload: true,
        });
      }
      // console.log("Current Width:", window.innerWidth);
      // console.log("Is Small Screen:", isScreenWide);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigateToProfile = (e) => {
    e.preventDefault();
    setIsMenuVisible(false);
    navigate(`/profile/${user._id}`);
  };

  const handleMenu = (e) => {
    e.preventDefault();
    setIsMenuVisible(!isMenuVisible);
  };

  const handleNavigateToSettings = (e) => {
    e.preventDefault();
    setIsMenuVisible(false);
    navigate(`/settings`);
  };

  return (
    <>
      <div
        className={`${params === "/photo" ? "hidden" : "block"} h-[65px]`}
      ></div>

      {/* Navbar */}
      <header
        style={{ fontFamily: "montserrat, sans-serif" }}
        className={` border-b fixed top-0 z-[10] text-black justify-between w-full bg-white flex items-center h-[65px]`}
      >
        {/* Mobile Search Input */}
        {/* {mobileSearchInput && (
          <div className="relative w-full px-4">
            <SearchButtonsForMobile />
          </div>
        )} */}

        {/* Other Navbar Content (Logo and Links) */}
        {
          <div
            className={` text-white border-black`}
            onClick={() => {
              
              handleClearInput();
              handleReload();
            }}
          >
            <Link to="/">
              <Logo />
            </Link>
          </div>
        }

        {/* Search Functionality for Desktop */}
        <div className="hidden md:block md:text-sm text-xsm lg:flex items-center px-2 py-2">
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
            {/* Desktop Search Input */}
            <input
              ref={searchInput}
              onChange={handleInputChange}
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

        <div className="flex border-black gap-5 justify-center items-center">
          {/* Controls */}

          <>
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
            <div className="hidden border-black  md:flex">
              <ul className="flex text-2xl items-center">
                {/* User Icon */}
                <li className="relative group px-2 cursor-pointer">
                  <span
                    className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-sky-400 to-green-300 group-hover:bg-gradient-to-r group-hover:from-green-300 group-hover:via-sky-400 group-hover:to-blue-500 transition duration-300"
                    style={{ WebkitTextFillColor: "transparent" }}
                  >
                    <i className="ri-user-fill text-2xl"></i>
                  </span>
                  <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-gray-600 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition duration-300">
                    Profile
                  </span>
                </li>

                {/* Message Icon */}
                <Link
                  to={`/messages`}
                  className=" px-2  relative group cursor-pointer"
                >
                  <li>
                    <span
                      className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-sky-400 to-green-300 group-hover:bg-gradient-to-r group-hover:from-green-300 group-hover:via-sky-400 group-hover:to-blue-500 transition duration-300"
                      style={{ WebkitTextFillColor: "transparent" }}
                    >
                      <i className="text-2xl ri-message-2-fill"></i>
                    </span>
                    <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-gray-600 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition duration-300">
                      Messages
                    </span>
                  </li>
                </Link>

                {/* Notifications Icon */}
                <li className="relative group px-2  cursor-pointer">
                  <span
                    className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-sky-400 to-green-300 group-hover:bg-gradient-to-r group-hover:from-green-300 group-hover:via-sky-400 group-hover:to-blue-500 transition duration-300"
                    style={{ WebkitTextFillColor: "transparent" }}
                  >
                    <i className="ri-notification-2-fill text-2xl"></i>
                  </span>
                  <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-gray-600 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition duration-300">
                    Notifications
                  </span>
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    1
                  </span>
                </li>
              </ul>
            </div>
          </>

          <div
            className={`  rounded-full cursor-pointer w-full  border-2 sm:border-none border-blue-500 flex justify-start items-center relative`}
          >
            <Link>
              <img
                onClick={handleMenuClick}
                src={
                  user?.profilePic ||
                  "https://res.cloudinary.com/datcr1zua/image/upload/v1739709690/uploads/rindbm34tibrtqcgvpsd.png"
                }
                alt="Profile"
                className={`w-[45px] h-[45px] sm:w-[50px] sm:h-[50px] border shadow-xl border-gray-300 sm:rounded-full rounded-l-full transition-all duration-300 object-cover ${
                  isMenuClicked
                    ? "scale-90 shadow-inner opacity-70"
                    : "scale-100"
                }`}
              />
            </Link>

            {/* Search Functionality for Mobile */}
            {!isSmScreen && (
              <button
                type="button"
                className="w-[45px] h-[45px] lg:w-[55px] lg:h-[55px] flex items-center justify-center rounded-r-full text-white bg-blue-500 hover:bg-blue-600 transition-all"
                onClick={handleMenu}
              >
                <i className="ri-menu-line text-xl"></i>

                {/* <i className="ri-search-2-line "></i> */}
              </button>
            )}

            {
              <div
                className={`${
                  isMenuVisible ? "h-screen border" : "h-0"
                } fixed top-[62px] left-0 bg-white overflow-hidden transition-all duration-200 shadow-2xl rounded-xl w-full`}
              >
                <SearchButtonsForMobile />
                <SearchSuggestions />

                {!searchedInput && (
                  <div className="divide-y divide-gray-200">
                    {/* User Info */}
                    <div
                      onClick={handleNavigateToProfile}
                      className="flex items-center px-4 py-4 hover:bg-gray-100 transition-colors"
                    >
                      <CurrentUserPhoto />
                      <span className="ml-4 text-gray-800 text-lg font-semibold">
                        {user.fullname}
                      </span>
                    </div>

                    {/* --- Section: Communication --- */}
                    <div className="py-2 px-2">
                      <h4 className="text-gray-500 text-sm font-semibold px-2 mb-1">
                        Communication
                      </h4>
                      <div
                        onClick={() => navigate("/messages")}
                        className="flex items-center px-2 py-3 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <span className="flex items-center justify-center text-white bg-gradient-to-r from-blue-500 to-blue-700 shadow rounded-full w-[45px] h-[45px]">
                          <i className="ri-messenger-fill text-2xl"></i>
                        </span>
                        <span className="ml-4 text-gray-700 text-base font-medium">
                          Messenger
                        </span>
                      </div>

                      <div
                        onClick={() => navigate("/friends")}
                        className="flex items-center px-2 py-3 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <span className="flex items-center justify-center text-white bg-gradient-to-r from-blue-500 to-blue-700 shadow rounded-full w-[45px] h-[45px]">
                          <i className="ri-group-fill text-2xl"></i>
                        </span>
                        <span className="ml-4 text-gray-700 text-base font-medium">
                          Friends
                        </span>
                      </div>
                    </div>

                    {/* --- Section: Settings --- */}
                    <div className="py-2 px-2">
                      <h4 className="text-gray-500 text-sm font-semibold px-2 mb-1">
                        Preferences
                      </h4>

                      <div
                        onClick={handleNavigateToSettings}
                        className="flex items-center px-2 py-3 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <span className="flex items-center justify-center text-white bg-gradient-to-r from-gray-500 to-gray-700 shadow rounded-full w-[45px] h-[45px]">
                          <i className="ri-settings-2-fill text-xl"></i>
                        </span>
                        <span className="ml-4 text-gray-700 text-base font-medium">
                          Settings & Privacy
                        </span>
                      </div>

                      <div className="flex items-center px-2 py-3 hover:bg-gray-100 rounded-lg transition-colors">
                        <span className="flex items-center justify-center text-white bg-gradient-to-r from-gray-500 to-gray-700 shadow rounded-full w-[45px] h-[45px]">
                          <i className="ri-question-fill text-2xl"></i>
                        </span>
                        <span className="ml-4 text-gray-700 text-base font-medium">
                          Help & Support
                        </span>
                      </div>

                      <div className="flex items-center px-2 py-3 hover:bg-gray-100 rounded-lg transition-colors">
                        <span className="flex items-center justify-center text-white bg-gradient-to-r from-gray-500 to-gray-700 shadow rounded-full w-[45px] h-[45px]">
                          <i className="ri-moon-fill text-2xl"></i>
                        </span>
                        <span className="ml-4 text-gray-700 text-base font-medium">
                          Display & Accessibility
                        </span>
                      </div>

                      <div className="flex items-center px-2 py-3 hover:bg-gray-100 rounded-lg transition-colors">
                        <span className="flex items-center justify-center text-white bg-gradient-to-r from-gray-500 to-gray-700 shadow rounded-full w-[45px] h-[45px]">
                          <i className="ri-feedback-fill text-2xl"></i>
                        </span>
                        <div className="ml-4">
                          <span className="text-gray-700 text-base font-medium">
                            Give Feedback
                          </span>
                          <span className="block text-gray-500 text-sm font-light">
                            CTRL + B
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* --- Logout --- */}
                    <div
                      onClick={handleLogOut}
                      className="flex items-center px-4 py-3 hover:bg-red-50 transition-colors"
                    >
                      <span className="flex items-center justify-center text-white bg-gradient-to-r from-red-500 to-red-700 shadow rounded-full h-[45px] w-[45px]">
                        <i className="ri-logout-box-r-fill text-2xl"></i>
                      </span>
                      <span className="ml-4 text-red-700 text-base font-medium">
                        Logout
                      </span>
                    </div>
                  </div>
                )}
              </div>
            }
          </div>
        </div>
        {/* {isPostPage && <div className="fixed inset-0 bg-black opacity-50"></div>} */}
      </header>
    </>
  );
}

export default Navbar;

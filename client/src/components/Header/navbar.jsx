import { navItems } from "../../constants/index.jsx";
import UserPhoto from "../currentUserPhoto.jsx";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../logo.jsx";
import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { Logout } from "../context/AuthActions.js";
import CurrentUserPhoto from "../currentUserPhoto.jsx";
import { searchUser } from "../../apiCalls.js";

function Navbar() {
  const { controlsIcons } = navItems;
  const { reload, isOverlayVisible, dispatch, SearchedUser, user } =
    useContext(AuthContext);
  const searchedUsername = useRef();
  const navigate = useNavigate();

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

  return (
    <>
      <div className="w-full h-[65px] "></div>
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
              <button className="cursor-pointer" onClick={handleGetOut}>
                Get Out
              </button>
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
          <CurrentUserPhoto />
        </div>
      </header>
    </>
  );
}

export default Navbar;

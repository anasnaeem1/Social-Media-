import Logo from "../../logo.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { UserContext } from "../context/UserContext.jsx";
import { Logout } from "../context/UserActions.js";
import SearchButtonsForMobile from "./SearchButtonsForMobile.jsx";
import SearchSuggestions from "../searchSuggestions/suggesionBox.jsx";
import { FeedContext } from "../context/FeedContext.jsx";

function Navbar() {
  const { dispatch, user, searchedInput } = useContext(UserContext);
  const location = useLocation();
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [isDesktopProfileOpen, setIsDesktopProfileOpen] = useState(false);
  const navigate = useNavigate();
  const [avatarPressed, setAvatarPressed] = useState(false);
  const searchInput = useRef(null);
  const [isWideScreen, setIsWideScreen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 640 : false
  );

  const desktopMenuRef = useRef(null);

  useEffect(() => {
    if (!searchInput.current) return;
    if (!searchedInput) {
      searchInput.current.value = "";
    } else {
      searchInput.current.value = searchedInput;
    }
  }, [searchedInput]);

  const closeAllMenus = useCallback(() => {
    setIsMobileSheetOpen(false);
    setIsDesktopProfileOpen(false);
  }, []);

  useEffect(() => {
    closeAllMenus();
  }, [location.pathname, closeAllMenus]);

  const handleInputChange = () => {
    if (!searchInput.current) return;
    const inputValue = searchInput.current.value || "";

    if (inputValue === "") {
      dispatch({ type: "SEARCHEDINPUT", payload: inputValue });
      return;
    }

    dispatch({ type: "SEARCHEDINPUT", payload: inputValue });
  };

  const pulseAvatar = () => {
    setAvatarPressed(true);
    setTimeout(() => setAvatarPressed(false), 200);
  };

  const handleLogOut = () => {
    dispatch(Logout());
    closeAllMenus();
    navigate("/login");
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    const input = searchInput.current?.value;

    if (input) {
      const formattedInput = input.trim().replace(/\s+/g, "-");

      navigate(`/search/${formattedInput}`);
      dispatch({ type: "SEARCHEDINPUT", payload: "" });
    }
  };

  const handleClearInput = () => {
    dispatch({ type: "SEARCHEDINPUT", payload: "" });
  };

  const handleNavigateToProfile = (e) => {
    if (e) e.preventDefault();
    closeAllMenus();
    navigate(`/profile/${user?._id}`);
  };

  const handleNavigateToSettings = (e) => {
    e?.preventDefault();
    closeAllMenus();
    navigate(`/settings`);
  };

  useEffect(() => {
    const handleResize = () => {
      const wide = window.innerWidth >= 640;
      setIsWideScreen(wide);
      if (wide && dispatch) {
        dispatch({
          type: "MOBILESEARCHINPUT",
          payload: false,
        });
        dispatch({
          type: "TOGGLE_PHOTO_COMMENTS",
          payload: false,
        });
        setIsMobileSheetOpen(false);
      }
      if (wide && searchedInput) {
        setIsMobileSheetOpen(false);
        dispatch({
          type: "MOBILESEARCHINPUT",
          payload: true,
        });
      }
      if (!wide) {
        setIsDesktopProfileOpen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [searchedInput, dispatch]);

  const { setFeedReload } = useContext(FeedContext);

  const handleLogoClick = () => {
    handleClearInput();
    setFeedReload(true);
  };

  const handleAvatarClick = (e) => {
    e.preventDefault();
    pulseAvatar();
    if (typeof window !== "undefined" && window.innerWidth >= 640) {
      setIsDesktopProfileOpen((v) => !v);
      setIsMobileSheetOpen(false);
    } else {
      setIsMobileSheetOpen((v) => !v);
      setIsDesktopProfileOpen(false);
    }
  };

  const toggleMobileSheetOnly = (e) => {
    e?.preventDefault();
    setIsMobileSheetOpen((v) => !v);
    setIsDesktopProfileOpen(false);
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeAllMenus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeAllMenus]);

  useEffect(() => {
    const onPointerDown = (e) => {
      if (
        desktopMenuRef.current &&
        !desktopMenuRef.current.contains(e.target)
      ) {
        setIsDesktopProfileOpen(false);
      }
    };
    if (isDesktopProfileOpen) {
      document.addEventListener("pointerdown", onPointerDown);
    }
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isDesktopProfileOpen]);

  const renderLogo = () => (
    <div className="text-white border-black" onClick={handleLogoClick}>
      <Link to="/">
        <Logo />
      </Link>
    </div>
  );

  const dropdownClass =
    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] font-medium text-slate-700 transition-colors hover:bg-slate-100 active:bg-slate-200/80";

  const sectionLabelClass =
    "px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400";

  const IconWrap = ({ children, gradient }) => (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-sm ${gradient}`}
    >
      {children}
    </span>
  );

  const accountMenu = !searchedInput ? (
    <div className="divide-y divide-slate-100">
      <div className="px-3 py-3">
        <button
          type="button"
          onClick={handleNavigateToProfile}
          className={`${dropdownClass} -mx-1`}
        >
          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-slate-100 shadow-sm ring-2 ring-white">
            <img
              src={
                user?.profilePic ||
                "https://res.cloudinary.com/datcr1zua/image/upload/v1739709690/uploads/rindbm34tibrtqcgvpsd.png"
              }
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold text-slate-900">
              {user?.fullname ?? "Account"}
            </p>
            <p className="truncate text-xs font-normal text-slate-500">
              View profile
            </p>
          </div>
          <i className="ri-arrow-right-s-line text-lg text-slate-400" />
        </button>
      </div>

      <div className="py-2">
        <p className={sectionLabelClass}>Communication</p>
        <nav className="flex flex-col gap-0.5 px-2">
          <button
            type="button"
            className={dropdownClass}
            onClick={() => {
              closeAllMenus();
              navigate("/messages");
            }}
          >
            <IconWrap gradient="bg-gradient-to-br from-blue-500 to-blue-600">
              <i className="ri-messenger-fill text-xl" />
            </IconWrap>
            Messenger
          </button>
          <button
            type="button"
            className={dropdownClass}
            onClick={() => {
              closeAllMenus();
              navigate("/friends");
            }}
          >
            <IconWrap gradient="bg-gradient-to-br from-emerald-500 to-teal-600">
              <i className="ri-group-fill text-xl" />
            </IconWrap>
            Friends
          </button>
        </nav>
      </div>

      <div className="py-2">
        <p className={sectionLabelClass}>Preferences</p>
        <nav className="flex flex-col gap-0.5 px-2">
          <button
            type="button"
            className={dropdownClass}
            onClick={handleNavigateToSettings}
          >
            <IconWrap gradient="bg-gradient-to-br from-slate-500 to-slate-600">
              <i className="ri-settings-4-fill text-lg" />
            </IconWrap>
            Settings &amp; Privacy
          </button>
          <button type="button" className={dropdownClass}>
            <IconWrap gradient="bg-gradient-to-br from-slate-400 to-slate-500">
              <i className="ri-question-fill text-xl" />
            </IconWrap>
            Help &amp; Support
          </button>
          <button type="button" className={dropdownClass}>
            <IconWrap gradient="bg-gradient-to-br from-indigo-500 to-violet-600">
              <i className="ri-moon-fill text-lg" />
            </IconWrap>
            Display &amp; Accessibility
          </button>
        </nav>
      </div>

      <div className="p-2">
        <button
          type="button"
          onClick={handleLogOut}
          className={`${dropdownClass} text-red-600 hover:bg-red-50 hover:text-red-700`}
        >
          <IconWrap gradient="bg-gradient-to-br from-red-500 to-rose-600">
            <i className="ri-logout-box-r-fill text-xl" />
          </IconWrap>
          Log out
        </button>
      </div>
    </div>
  ) : null;

  const mobileSearchBlock = (
    <div className="border-slate-100 bg-slate-50/80 px-1 py-2 sm:border-t">
      <SearchButtonsForMobile />
      <SearchSuggestions />
    </div>
  );

  useEffect(() => {
    if (!isWideScreen && isMobileSheetOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isWideScreen, isMobileSheetOpen]);

  const hideNavSpacer = location.pathname.includes("/photo/");

  return (
    <>
      <div className={`${hideNavSpacer ? "hidden" : "block"} h-[65px]`}></div>

      <header
        style={{ fontFamily: "montserrat, sans-serif" }}
        className="fixed top-0 z-[100] flex h-[65px] w-full items-center justify-between border-b border-slate-200/80 bg-white text-black shadow-sm"
      >
        {renderLogo()}

        <div className="hidden items-center px-2 py-2 text-xsm md:block md:flex md:text-sm lg:flex">
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
            <input
              ref={searchInput}
              onChange={handleInputChange}
              type="text"
              placeholder="Search..."
              className="w-full rounded-full border border-gray-300 bg-transparent px-3 py-2 text-black transition-all duration-300 focus:px-6 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
            />

            <button
              type="submit"
              className="absolute right-0 top-0 bottom-0 flex items-center justify-center rounded-r-full border border-gray-300 border-l-0 bg-blue-500 px-4 text-white transition-colors hover:bg-blue-600"
              aria-label="Search"
            >
              <i className="ri-search-line text-lg"></i>
            </button>
          </form>
        </div>

        <div className="flex items-center justify-center gap-3 border-black sm:gap-5">
          <>
            <div>
              <ul className="flex gap-3 text-lg sm:gap-2">
                <Link
                  to={user ? "/profile/" + user._id : undefined}
                  className="hidden sm:flex"
                  onClick={closeAllMenus}
                >
                  <li className="text-md text-slate-700 transition-colors hover:text-blue-600">
                    Home
                  </li>
                </Link>

                <Link to="/" className="hidden sm:flex" onClick={closeAllMenus}>
                  <li className="text-md text-slate-700 transition-colors hover:text-blue-600">
                    Timeline
                  </li>
                </Link>
              </ul>
            </div>

            <div className="hidden border-black md:flex">
              <ul className="flex items-center text-2xl">
                <li className="group relative cursor-pointer px-2">
                  <Link
                    to={user ? `/profile/${user._id}` : "#"}
                    onClick={closeAllMenus}
                    className="inline-block"
                    aria-label="Profile"
                  >
                    <span
                      className="bg-gradient-to-r from-blue-500 via-sky-400 to-green-300 bg-clip-text text-transparent transition duration-300 group-hover:bg-gradient-to-r group-hover:from-green-300 group-hover:via-sky-400 group-hover:to-blue-500"
                      style={{ WebkitTextFillColor: "transparent" }}
                    >
                      <i className="ri-user-fill text-2xl"></i>
                    </span>
                  </Link>
                  <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 transform text-sm text-gray-600 opacity-0 transition duration-300 group-hover:translate-y-1 group-hover:opacity-100">
                    Profile
                  </span>
                </li>

                <Link
                  to={`/messages`}
                  className="relative group cursor-pointer px-2"
                  onClick={closeAllMenus}
                >
                  <li>
                    <span
                      className="bg-gradient-to-r from-blue-500 via-sky-400 to-green-300 bg-clip-text text-transparent transition duration-300 group-hover:bg-gradient-to-r group-hover:from-green-300 group-hover:via-sky-400 group-hover:to-blue-500"
                      style={{ WebkitTextFillColor: "transparent" }}
                    >
                      <i className="text-2xl ri-message-2-fill"></i>
                    </span>
                    <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 transform text-sm text-gray-600 opacity-0 transition duration-300 group-hover:translate-y-1 group-hover:opacity-100">
                      Messages
                    </span>
                  </li>
                </Link>

                <li className="group relative cursor-pointer px-2">
                  <span
                    className="bg-gradient-to-r from-blue-500 via-sky-400 to-green-300 bg-clip-text text-transparent transition duration-300 group-hover:bg-gradient-to-r group-hover:from-green-300 group-hover:via-sky-400 group-hover:to-blue-500"
                    style={{ WebkitTextFillColor: "transparent" }}
                  >
                    <i className="ri-notification-2-fill text-2xl"></i>
                  </span>
                  <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 transform text-sm text-gray-600 opacity-0 transition duration-300 group-hover:translate-y-1 group-hover:opacity-100">
                    Notifications
                  </span>
                  <span className="absolute -top-1.5 -right-1 rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white shadow-sm">
                    1
                  </span>
                </li>
              </ul>
            </div>
          </>

          <div className="relative flex items-center gap-2" ref={desktopMenuRef}>
            <button
              type="button"
              onClick={handleAvatarClick}
              aria-expanded={isWideScreen ? isDesktopProfileOpen : isMobileSheetOpen}
              aria-haspopup="true"
              className={`relative shrink-0 overflow-hidden rounded-full border-2 border-slate-200 shadow-md outline-none ring-offset-2 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 ${avatarPressed ? "scale-95 opacity-80" : "scale-100"}`}
              title="Account menu"
            >
              <img
                src={
                  user?.profilePic ||
                  "https://res.cloudinary.com/datcr1zua/image/upload/v1739709690/uploads/rindbm34tibrtqcgvpsd.png"
                }
                alt="Profile"
                className="block h-[45px] w-[45px] object-cover sm:h-[50px] sm:w-[50px]"
              />
            </button>

            {!isWideScreen && (
              <button
                type="button"
                onClick={toggleMobileSheetOnly}
                aria-expanded={isMobileSheetOpen}
                aria-label="Open menu"
                className="flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 shadow-sm transition hover:bg-slate-100 lg:h-[52px] lg:w-[52px]"
              >
                <i className={`ri-menu-line text-xl transition-transform ${isMobileSheetOpen ? "rotate-90" : ""}`} />
              </button>
            )}

            {/* Desktop account dropdown */}
            <div
              className={`absolute right-0 top-[calc(100%+10px)] z-[120] hidden w-[min(calc(100vw-24px),20rem)] sm:block origin-top-right transition-[opacity,transform] duration-200 ease-out ${isDesktopProfileOpen ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"}`}
              style={{ visibility: isDesktopProfileOpen ? "visible" : "hidden" }}
              role="menu"
              aria-hidden={!isDesktopProfileOpen}
            >
              <div className="max-h-[min(70vh,520px)] overflow-y-auto overflow-x-hidden rounded-2xl border border-slate-200/90 bg-white py-2 shadow-xl shadow-slate-200/50 ring-1 ring-black/5">
                {accountMenu}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile sheet + backdrop */}
        {!isWideScreen && isMobileSheetOpen ? (
          <div
            role="presentation"
            className="fixed inset-x-0 top-[65px] bottom-0 z-[105] transition-opacity duration-200"
            aria-hidden={!isMobileSheetOpen}
          >
            <div
              className="absolute inset-0 bg-slate-900/25 backdrop-blur-[2px] transition-opacity duration-200"
              onClick={() => setIsMobileSheetOpen(false)}
              onKeyDown={(e) =>
                e.key === "Escape" && setIsMobileSheetOpen(false)
              }
              tabIndex={-1}
            />
            <div
              className="absolute inset-x-0 top-0 mx-auto mt-2 max-h-[calc(100%-1rem)] w-[calc(100%-16px)] max-w-lg overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl ring-1 ring-black/5"
              role="dialog"
              aria-modal="false"
              aria-label="Account and search"
            >
              <div className="scrollbar-thin max-h-[calc(100vh-5.5rem)] overflow-y-auto">
                <div className="sticky top-0 z-[1] flex items-center justify-between border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur-sm">
                  <span className="text-sm font-semibold text-slate-800">
                    Menu
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsMobileSheetOpen(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                    aria-label="Close menu"
                  >
                    <i className="ri-close-line text-2xl" />
                  </button>
                </div>
                <div className="p-0 pb-3">
                  {mobileSearchBlock}
                  {accountMenu}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </header>
    </>
  );
}

export default Navbar;

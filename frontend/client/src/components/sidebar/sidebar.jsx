import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { sidebarContext } from "../context/sidebarContext";
import { UserContext } from "../context/UserContext";
import UsersList from "../Home/usersLists/usersList";
import UserPhoto from "../userPhoto";

const WIDTH_HOME = "w-72";
const WIDTH_FRIENDS = "w-[296px]";

const SPACER_LG = "hidden lg:block";
const RAIL_LG_COL = "hidden lg:flex lg:flex-col";

function Sidebar({ mainItems: _mainItems, userId }) {
  const { buttons, sidebarPage } = useContext(sidebarContext);
  const { user } = useContext(UserContext);

  const Navigate = useNavigate();
  const menuButtons = buttons?.buttons;

  function isFriendsSidebarPage(page) {
    return typeof page === "string" && page.startsWith("friends");
  }

  function isFriendsHomePage(page) {
    return page === "friendsHome";
  }

  function isFriendsRequestsPage(page) {
    return page === "friendsRequests";
  }

  function isFriendsListPage(page) {
    return page === "friendsList";
  }

  function shouldShowUsersList(page) {
    return isFriendsRequestsPage(page) || isFriendsListPage(page);
  }

  /** Clear sub-label for the Friends stack (not the user card). */
  function getFriendsContextLabel(page) {
    if (isFriendsRequestsPage(page)) return "Friend requests";
    if (isFriendsListPage(page)) return "Your friend list";
    return null;
  }

  const friendsMode = isFriendsSidebarPage(sidebarPage);
  const railWidth = friendsMode ? WIDTH_FRIENDS : WIDTH_HOME;
  const spacerClasses = `shrink-0 min-h-0 ${SPACER_LG} ${railWidth}`;

  function handleUserCardClick() {
    return userId ? Navigate("/") : Navigate(`/profile/${user?._id ?? ""}`);
  }

  const goMyProfile = () => Navigate(`/profile/${user?._id ?? ""}`);

  return (
    <>
      <div className={`${spacerClasses} transition-[width]`} aria-hidden />

      <div
        className={`fixed top-[65px] z-40 ${RAIL_LG_COL} ${railWidth} h-[calc(100vh-65px)] max-h-[calc(100vh-65px)] shrink-0 overflow-hidden border-r border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-sm transition-all duration-300 lg:rounded-tr-2xl lg:rounded-br-2xl`}
      >
        <div className="flex min-h-0 flex-1 flex-col gap-4 p-4">
          <div className="shrink-0">
            {friendsMode ? (
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm ring-1 ring-slate-950/5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => Navigate(-1)}
                    aria-label="Go back"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200"
                  >
                    <i className="ri-arrow-left-line text-xl" />
                  </button>

                  <div className="min-w-0 flex-1 px-1 text-center">
                    <h1 className="text-base font-semibold leading-snug text-slate-900">
                      Friends
                    </h1>
                    {shouldShowUsersList(sidebarPage) && (
                      <p className="mt-0.5 text-xs font-medium text-slate-500">
                        {getFriendsContextLabel(sidebarPage)}
                      </p>
                    )}
                  </div>

                  {isFriendsHomePage(sidebarPage) ? (
                    <button
                      type="button"
                      onClick={() => Navigate("/settings")}
                      aria-label="Settings"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200"
                    >
                      <i className="ri-settings-2-fill text-xl" />
                    </button>
                  ) : (
                    <div className="h-10 w-10 shrink-0" aria-hidden />
                  )}
                </div>

                {/* Signed-in user: full avatar + name (line-clamp so long names stay visible, not a single chopped line). */}
                <button
                  type="button"
                  onClick={goMyProfile}
                  className="flex w-full min-w-0 items-start gap-3 rounded-xl bg-slate-50 px-3 py-2.5 text-left ring-1 ring-inset ring-slate-200/80 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <div className="shrink-0 pt-0.5">
                    <UserPhoto userId={user?._id} user={user} lg />
                  </div>
                  <span className="min-w-0 flex-1 pt-0.5">
                    <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      You
                    </span>
                    <span className="mt-0.5 block line-clamp-2 break-words text-sm font-semibold leading-snug text-slate-900">
                      {user?.fullname ?? "Account"}
                    </span>
                  </span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleUserCardClick}
                className="flex w-full min-w-0 cursor-pointer items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 text-left shadow-sm ring-1 ring-slate-950/5 transition-colors hover:bg-slate-50"
              >
                <div className="shrink-0">
                  <UserPhoto userId={user?._id} user={user} lg />
                </div>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    You
                  </span>
                  <span className="mt-0.5 block line-clamp-2 break-words text-sm font-semibold leading-snug text-slate-900">
                    {user?.fullname}
                  </span>
                </span>
              </button>
            )}
          </div>

          <div className="custom-scrollbar min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
            {shouldShowUsersList(sidebarPage) ? (
              <section
                className="min-w-0 overflow-x-hidden rounded-2xl border border-slate-200/80 bg-slate-50/90 p-3 shadow-inner ring-1 ring-slate-950/5 sm:p-4"
                aria-label={
                  isFriendsRequestsPage(sidebarPage)
                    ? "Follow requests list"
                    : "Friends list"
                }
              >
                <UsersList
                  isFriendsRequestPage={isFriendsRequestsPage(sidebarPage)}
                  isFriendsListPage={isFriendsListPage(sidebarPage)}
                />
              </section>
            ) : (
              <nav className="flex flex-col gap-2">
                {Array.isArray(menuButtons) &&
                  menuButtons.map((item) => {
                    const isSelected =
                      isFriendsHomePage(sidebarPage) && item.label === "Home";

                    return (
                      <div
                        key={item.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => Navigate(item.path)}
                        onKeyDown={(e) => e.key === "Enter" && Navigate(item.path)}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 transition-all ${
                          isSelected
                            ? "border-blue-200 bg-blue-50"
                            : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            isSelected
                              ? "bg-gradient-to-r from-gray-200 to-gray-300"
                              : "bg-gradient-to-r from-gray-100 to-gray-200"
                          }`}
                        >
                          {item.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span
                            className={`block truncate font-medium ${
                              isSelected ? "text-blue-700" : "text-gray-700"
                            }`}
                          >
                            {item.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </nav>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;

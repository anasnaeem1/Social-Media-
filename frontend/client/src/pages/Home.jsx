import { useLocation } from "react-router-dom";
import React, { useContext } from "react";
import Feed from "../components/Home/feed/feed";
import SearchSuggestions from "../components/searchSuggestions/suggesionBox";
import Others from "../components/Home/others/others";
import * as mainItems from "../constants/index";
import currentUserPhoto from "../components/currentUserPhoto";
import SeperatingLine from "../components/seperatingLine";
import SidebarWrapper from "../components/sidebar/SidebarWrapper";
import Search from "../components/Search/search1";
import FriendsPage from "../components/Home/friendsPage/friendsPage";
import SettingsPage from "../components/Home/settingsPage/settingsPage";
import FloatingBox from "../components/Home/floatingBox/floatingBox";
import { UserContext } from "../components/context/UserContext";

function Home({ reload }) {
  const location = useLocation();
  const isBirthdayPage = location.pathname.startsWith("/friends/birthdays");
  const isPostPage = location.pathname.startsWith("/post");
  const isSettingPage = location.pathname.startsWith("/settings");
  const isFriendsBranch = location.pathname.startsWith("/friends");
  const isSearchBranch = location.pathname.startsWith("/search");
  const { floatingBox, dispatch } = useContext(UserContext);

  const shellClass = [
    "relative flex w-full flex-1 flex-col",
    isPostPage ? "overflow-hidden" : "min-h-[calc(100vh-65px)]",
  ].join(" ");

  const shellStyle = isPostPage
    ? { height: "calc(100vh - 65px)" }
    : undefined;

  const mainColumn = (
    <main className="flex min-h-0 w-full min-w-0 flex-1 justify-center">
      <div className="w-full max-w-[550px]">
        <Feed
          home={true}
          reload={reload}
          currentUserPhoto={currentUserPhoto}
          mainItems={mainItems}
          SeperatingLine={SeperatingLine}
        />
      </div>
    </main>
  );

  return (
    <>
      {dispatch && (
        <div className={shellClass} style={shellStyle}>
          <div className="pointer-events-none fixed left-0 right-0 top-[65px] z-50 isolate">
            <div className="pointer-events-auto">
              <SearchSuggestions forMobile={true} />
            </div>
          </div>

          <div
            className={`flex w-full flex-1 flex-col lg:flex-row lg:items-start ${
              isPostPage ? "min-h-0" : ""
            }`}
          >
            {!isBirthdayPage && (
              <SidebarWrapper
                currentUserPhoto={currentUserPhoto}
                mainItems={mainItems}
                SeperatingLine={SeperatingLine}
              />
            )}

            {isSettingPage ? (
              <div className="flex min-h-[calc(100vh-65px)] w-full min-w-0 flex-1 justify-center px-4 py-6 sm:px-6">
                <div className="w-full max-w-3xl">
                  <SettingsPage />
                </div>
              </div>
            ) : isFriendsBranch ? (
              <div className="flex min-h-[calc(100vh-65px)] w-full min-w-0 flex-1 justify-center px-4 py-6 sm:px-6">
                <div className="w-full max-w-4xl">
                  <FriendsPage />
                </div>
              </div>
            ) : isSearchBranch ? (
              <div className="flex min-h-[calc(100vh-65px)] w-full min-w-0 flex-1 justify-center px-4 py-6 sm:px-6">
                <div className="w-full max-w-[720px]">
                  <Search />
                </div>
              </div>
            ) : (
              <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:flex-row lg:items-start xl:max-w-[1320px] xl:gap-10">
                {mainColumn}
                <Others
                  currentUserPhoto={currentUserPhoto}
                  mainItems={mainItems}
                  SeperatingLine={SeperatingLine}
                />
              </div>
            )}
          </div>

          {!floatingBox.disable && floatingBox.purpose === "deletePost" ? (
            <FloatingBox />
          ) : null}
        </div>
      )}
    </>
  );
}

export default Home;

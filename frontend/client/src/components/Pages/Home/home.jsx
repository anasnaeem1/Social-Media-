import { useLocation, useParams } from "react-router-dom";
import Feed from "./feed/feed";
import SearchSuggestions from "../searchSuggestions/suggesionBox";
import Others from "./others/others";
import * as mainItems from "../../../constants/index";
import currentUserPhoto from "../../currentUserPhoto";
import SeperatingLine from "../../seperatingLine";
import Options from "../options/options";
import Search from "../Search/search1";
import FriendsPage from "./friendsPage/friendsPage";
import PostDetails from "./SinglePostDeatils/postDetails";
import SettingsPage from "./settingsPage/settingsPage";
import FloatingBox from "./floatingBox/floatingBox";
import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";

function Home({ reload }) {
  const location = useLocation();
  const isPostPage = location.pathname.startsWith("/post");
  const isSettingPage = location.pathname.startsWith("/settings");
  const { user, floatingBox, dispatch, mobileSearchInput } =
    useContext(UserContext);

  return (
    <>
      {dispatch && (
        <div
          className={`${
            isPostPage ? "overflow-hidden " : ""
          } relative flex flex-col md:flex-row  justify-center md:justify-between w-full`}
          style={{ height: isPostPage && "calc(100vh - 65px)" }}
        >
          {/* Options Component */}
            <div className="fixed  w-full top-[65px] left-0 bg-white z-50">
              <SearchSuggestions forMobile={true} />
            </div>
          <Options
            currentUserPhoto={currentUserPhoto}
            mainItems={mainItems}
            SeperatingLine={SeperatingLine}
            // className="flex-shrink-0 hidden md:block md:w-[250px] lg:w-[300px] xl:w-[350px]"
          />

          {location.pathname.startsWith("/settings") ? (
            <SettingsPage />
          ) : location.pathname.startsWith("/friends") ? (
            <FriendsPage />
          ) : (
            <>
              {" "}
              {location.pathname.startsWith("/search") ? (
                <Search />
              ) : (
                <div className="flex-grow w-full flex justify-center border-blue-300 lg:max-w-[560px]">
                  <Feed
                    home={true}
                    reload={reload}
                    currentUserPhoto={currentUserPhoto}
                    mainItems={mainItems}
                    SeperatingLine={SeperatingLine}
                  />
                </div>
              )}
              {/* Others Component */}
              <>
                <Others
                  currentUserPhoto={currentUserPhoto}
                  mainItems={mainItems}
                  SeperatingLine={SeperatingLine}
                />
              </>
            </>
          )}
          {true && <PostDetails />}
          {!floatingBox.disable && <FloatingBox height="200px" width="350px" />}
        </div>
      )}
    </>
  );
}

export default Home;

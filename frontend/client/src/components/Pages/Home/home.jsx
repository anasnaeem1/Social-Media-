import { useLocation } from "react-router-dom";
import Feed from "./feed/feed";
import SearchSuggestions from "../searchSuggestions/suggesionBox";
import Others from "./others/others";
import * as mainItems from "../../../constants/index";
import currentUserPhoto from "../../currentUserPhoto";
import SeperatingLine from "../../seperatingLine";
import Options from "../options/options";
import Search from "../Search/search1";
import FriendsPage from "./friendsPage/friendsPage";

function Home({ reload }) {
  const location = useLocation();

  return (
    <div className="relative flex flex-col md:flex-row justify-center md:justify-between w-full">
      {/* Options Component */}
      <div className="fixed  w-full top-[65px] left-0 bg-white z-50">
        <SearchSuggestions />
      </div>

      <Options
        currentUserPhoto={currentUserPhoto}
        mainItems={mainItems}
        SeperatingLine={SeperatingLine}
        // className="flex-shrink-0 hidden md:block md:w-[250px] lg:w-[300px] xl:w-[350px]"
      />

      {location.pathname.startsWith("/friends") ? (
        <FriendsPage />
      ) : (
        <>
          {" "}
          {location.pathname.startsWith("/search") ? (
            <Search />
          ) : (
            <>
              {/* Feed Component */}
              <div className="flex-grow w-full lg:max-w-[560px]">
                <Feed
                  home={true}
                  reload={reload}
                  currentUserPhoto={currentUserPhoto}
                  mainItems={mainItems}
                  SeperatingLine={SeperatingLine}
                />
              </div>
            </>
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
    </div>
  );
}

export default Home;

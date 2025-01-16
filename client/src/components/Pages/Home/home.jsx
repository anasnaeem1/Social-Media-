import Feed from "./feed/feed";
import SearchSuggestions from "../searchSuggestions/suggesionBox"
import Others from "./others/others";
import * as mainItems from "../../../constants/index";
import currentUserPhoto from "../../currentUserPhoto";
// import UserPhoto from "../../userPhoto";
import SeperatingLine from "../../seperatingLine";
import Options from "../options/options";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

function Home({ reload }) {
  // const { user } = useContext(UserContext);

  return (
    <div className="relative flex flex-col md:flex-row justify-center md:justify-between overflow-x-hidden w-full">
      {/* Options Component */}
      <SearchSuggestions/>
      <Options
        currentUserPhoto={currentUserPhoto}
        mainItems={mainItems}
        SeperatingLine={SeperatingLine}
        className="flex-shrink-0 hidden md:block md:w-[250px] lg:w-[300px] xl:w-[350px]"
      />

      {/* Feed Component */}

      <Feed
        reload={reload}
        currentUserPhoto={currentUserPhoto}
        mainItems={mainItems}
        SeperatingLine={SeperatingLine}
      />

      {/* Others Component */}
      <Others
        currentUserPhoto={currentUserPhoto}
        mainItems={mainItems}
        SeperatingLine={SeperatingLine}
        className="hidden lg:block lg:w-[250px] xl:w-[300px]"
      />
    </div>
  );
}

export default Home;

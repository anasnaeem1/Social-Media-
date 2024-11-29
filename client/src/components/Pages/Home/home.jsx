import Feed from "./feed/feed";
import Others from "./others/others";
import * as mainItems from "../../../constants/index";
import UserPhoto from "../../../userPhoto";
import SeperatingLine from "../../seperatingLine";
import Options from "../options/options";

function home() {
  return (
    <>
      <div className="flex justify-center md:justify-between ">
        <Options
          visibility="hidden md:block"
          UserPhoto={UserPhoto}
          mainItems={mainItems}
          SeperatingLine={SeperatingLine}
        />
        <Feed
          UserPhoto={UserPhoto}
          mainItems={mainItems}
          SeperatingLine={SeperatingLine}
        />
        <Others
          UserPhoto={UserPhoto}
          mainItems={mainItems}
          SeperatingLine={SeperatingLine}
        />
      </div>
    </>
  );
}

export default home;

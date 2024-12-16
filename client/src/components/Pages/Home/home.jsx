import Feed from "./feed/feed";
import Others from "./others/others";
import * as mainItems from "../../../constants/index";
import currentUserPhoto from "../../currentUserPhoto";
import SeperatingLine from "../../seperatingLine";
import Options from "../options/options";

function home({ reload }) {
  return (
    <>
      <div className="flex justify-center md:justify-between ">
        <Options
          visibility="hidden md:block"
          currentUserPhoto={currentUserPhoto}
          mainItems={mainItems}
          SeperatingLine={SeperatingLine}
        />
        <Feed
          reload={reload}
          currentUserPhoto={currentUserPhoto}
          mainItems={mainItems}
          SeperatingLine={SeperatingLine}
        />
        <Others
          currentUserPhoto={currentUserPhoto}
          mainItems={mainItems}
          SeperatingLine={SeperatingLine}
        />
      </div>
    </>
  );
}

export default home;

import Options from "./options/options";
import Feed from "./feed/feed";
import Others from "./others/others";
import * as mainItems from "../../../constants/index";
import UserPhoto from "../../../userPhoto";
import SeperatingLine from "../../seperatingLine";
import Navbar from "../../Header/navbar";


function home() {
  return (
    <div className="flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex justify-center md:justify-between">
        <Options
          Class={"hidden md:flex"}
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
    </div>
  );
}

export default home;

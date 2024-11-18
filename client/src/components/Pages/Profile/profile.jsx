import Options from "../Home/options/options";
import * as mainItems from "../../../constants/index";
import UserPhoto from "../../../userPhoto";
import SeperatingLine from "../../seperatingLine";
import Navbar from "../../Header/navbar";
import User from "./userProfile/user";

function profile() {
  return (
    <div>
      <Navbar />
      <div className="flex justify-center ">
        <Options
          Class={"hidden lg:flex"}
          UserPhoto={UserPhoto}
          mainItems={mainItems}
          SeperatingLine={SeperatingLine}
        />
        <User
          UserPhoto={UserPhoto}
          mainItems={mainItems}
          SeperatingLine={SeperatingLine}
        />
      </div>
    </div>
  );
}
export default profile;

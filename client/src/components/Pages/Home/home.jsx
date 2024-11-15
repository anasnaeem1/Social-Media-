import Options from "./options/options";
import Feed from "./feed/feed";
import Others from "./others/others";
import * as mainItems  from "../../../constants/index";
import UserPhoto from "../../../user"
import SeperatingLine from "../../seperatingLine";

function home() {
  return (
    <div className="flex justify-between gap-10">
    <Options UserPhoto={UserPhoto} mainItems={mainItems} SeperatingLine={SeperatingLine} />
    <Feed UserPhoto={UserPhoto} mainItems={mainItems} SeperatingLine={SeperatingLine} />
    <Others UserPhoto={UserPhoto} mainItems={mainItems} SeperatingLine={SeperatingLine}/>
  </div>
  );
}
export default home;

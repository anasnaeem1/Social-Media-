import Options from "../options/options";
import * as mainItems from "../../../constants/index";
import CurrentUserPhoto from "../../currentUserPhoto";
import SeperatingLine from "../../seperatingLine";
import User from "./userProfile/user";
import "react-loading-skeleton/dist/skeleton.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router";
import SearchSuggestions from "../searchSuggestions/suggesionBox";
import { UserContext } from "../../context/UserContext";
import FloatingBox from "../Home/floatingBox/floatingBox"
// import ProfileSkeleton from "../../Skeleton/profileSkeleton/profileSkeleton";

function Profile() {
  // const PA = import.meta.env.VITE_PUBLIC_API;
  const {user: currentUser, floatingBox} = useContext(UserContext)
  const [user, setUser] = useState({});
  const { userId } = useParams();
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setProfileLoading(true);
      try {
        const res = await axios.get(`/api/users?userId=${userId}`);
        setUser(res.data);
      } catch (error) {
        console.log("Error at fetching", error);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  // Scroll to top when Profile is loaded or userId changes
  // useEffect(() => {
  //   console.log("Scroll to top triggered");
  //   setTimeout(() => {
  //     window.scrollTo(0, 0);
  //   }, 0);
  // }, []);

  return (
    <div>
      <div className="relative flex justify-center overflow-x-hidden">
        <SearchSuggestions forMobile={true}/>
        <Options
          userId={userId}
          CurrentUserPhoto={CurrentUserPhoto}
          mainItems={mainItems}
          SeperatingLine={SeperatingLine}
        />
        <User
          profileLoading={profileLoading}
          userId={userId}
          profileUser={user}
          CurrentUserPhoto={CurrentUserPhoto}
          mainItems={mainItems}
          SeperatingLine={SeperatingLine}
        />
      </div>
      {!floatingBox.disable && <FloatingBox height={"200px"} width={"450px"} />}
    </div>
  );
}

export default Profile;

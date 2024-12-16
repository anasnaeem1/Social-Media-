import Options from "../options/options";
import * as mainItems from "../../../constants/index";
import CurrentUserPhoto from "../../currentUserPhoto";
import SeperatingLine from "../../seperatingLine";
import Navbar from "../../Header/navbar";
import User from "./userProfile/user";
import "react-loading-skeleton/dist/skeleton.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";
// import ProfileSkeleton from "../../Skeleton/profileSkeleton/profileSkeleton";

function profile() {
  const PA = import.meta.env.VITE_PUBLIC_API;
  const [user, setUser] = useState({});
  const userId = useParams().id;
  const [profileLoading, setProfileLoading] = useState(true);
  // console.log(userId)

  useEffect(() => {
    const fetchUser = async () => {
      setProfileLoading(true)
      try {
        const res = await axios.get(`${PA}/api/users?userId=${userId}`);
        setUser(res.data);
        console.log(res.data);
      } catch (error) {
        console.log("Error at fetching", error);
      }
      finally{
        setProfileLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  return (
    <div>
      <div className="flex justify-center ">
        <Options
          visibility="hidden lg:block"
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
    </div>
  );
}
export default profile;

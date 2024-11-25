import Options from "../options/options";
import * as mainItems from "../../../constants/index";
import UserPhoto from "../../../userPhoto";
import SeperatingLine from "../../seperatingLine";
import Navbar from "../../Header/navbar";
import User from "./userProfile/user";
import "react-loading-skeleton/dist/skeleton.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";
// import ProfileSkeleton from "../../Skeleton/profileSkeleton/profileSkeleton";

function profile() {
  const [user, setUser] = useState({});
  const username = useParams().username;
  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/users?username=${username}`
        );

        setUser(res.data);
        // setIsLoading(false);
        // console.log(res.data);
      } catch (error) {
        console.log("Error at fetching", error);
      }
    };
    fetchUser();
  }, [username]);
  return (
    <div>
      <div className="flex justify-center ">
      <Options
          visibility="hidden lg:block"
          UserPhoto={UserPhoto}
          mainItems={mainItems}
          SeperatingLine={SeperatingLine}
        />
        <User
          username={username}
          user={user}
          UserPhoto={UserPhoto}
          mainItems={mainItems}
          SeperatingLine={SeperatingLine}
        />
      </div>
    </div>
  );
}
export default profile;

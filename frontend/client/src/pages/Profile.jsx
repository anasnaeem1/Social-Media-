import SidebarWrapper from "../components/sidebar/SidebarWrapper";
import * as mainItems from "../constants/index";
import CurrentUserPhoto from "../components/currentUserPhoto";
import SeperatingLine from "../components/seperatingLine";
import User from "../components/Profile/userProfile/user";
import "react-loading-skeleton/dist/skeleton.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import SearchSuggestions from "../components/searchSuggestions/suggesionBox";
import { UserContext } from "../components/context/UserContext";
import FloatingBox from "../components/Home/floatingBox/floatingBox";

function Profile() {
  const { floatingBox } = useContext(UserContext);
  const [profileUserPayload, setProfileUserPayload] = useState({});
  const { userId } = useParams();
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setProfileLoading(true);
      try {
        const res = await axios.get(`/api/users?userId=${userId}`);
        setProfileUserPayload(res.data);
      } catch (error) {
        console.log("Error at fetching", error);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full overflow-x-hidden bg-slate-50/70 lg:bg-gradient-to-br lg:from-white lg:to-slate-50/80">
      <div className="pointer-events-none fixed left-0 right-0 top-[65px] z-50 isolate">
        <div className="pointer-events-auto">
          <SearchSuggestions forMobile={true} />
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-65px)] w-full flex-col lg:flex-row lg:items-start">
        <SidebarWrapper
          userId={userId}
          mainItems={mainItems}
          SeperatingLine={SeperatingLine}
        />

        <main
          id="profile-main"
          className="flex min-h-0 w-full min-w-0 flex-1 flex-col"
        >
          {/* Mobile: no horizontal inset so cover can span edge-to-edge. md+: matches Home gutters. */}
          <div className="mx-auto w-full max-w-[1280px] flex-1 md:py-8 xl:max-w-[1320px]">
            <div className="px-0 pb-12 md:px-6 lg:px-8">
              <User
                profileLoading={profileLoading}
                userId={userId}
                profileUser={profileUserPayload}
                currentUserPhoto={CurrentUserPhoto}
                mainItems={mainItems}
                SeperatingLine={SeperatingLine}
              />
            </div>
          </div>
        </main>
      </div>

      {!floatingBox.disable && floatingBox.purpose === "deletePost" ? (
        <FloatingBox />
      ) : null}
    </div>
  );
}

export default Profile;

import Feed from "../../Home/feed/feed";
// import noAvatar from "../../../../assets/noAvatar.jpg";
// import noCover from "../../../../assets/noCover.jpg";
import UserInfo from "./userInfo";
import ProfilePicSkeleton from "../../../Skeleton/profileSkeleton/profilePicSkeleton";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";

function User({
  isLoading,
  username,
  profileUser,
  UserPhoto,
  mainItems,
  SeperatingLine,
}) {
  const { dispatch, user: currentUser } = useContext(AuthContext);
  const PA = import.meta.env.VITE_PUBLIC_API;
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const { Friends } = mainItems;
  const [followed, setFollowed] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    if (profileUser._id && Array.isArray(currentUser.followings)) {
      const normalizedFollowings = currentUser.followings.map((id) =>
        id.toString()
      );
      const isFollowed = normalizedFollowings.includes(
        profileUser._id.toString()
      );
      console.log("Includes:", isFollowed);
      setFollowed(isFollowed);
    }
  }, [currentUser.followings, profileUser._id]);

  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      if (followed) {
        await axios.put(`${PA}/api/users/${profileUser._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: profileUser._id });
      } else {
        await axios.put(`${PA}/api/users/${profileUser._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: profileUser._id });
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <div className="flex-[7]">
      {/* Cover and Profile Picture */}
      {isLoading ? (
        <ProfilePicSkeleton />
      ) : (
        <div className="relative">
          <div
            className="h-[300px] rounded-md mx-auto max-w-7xl w-full"
            style={{
              backgroundImage: `url(${
                profileUser.coverPic
                  ? PF + "Person/" + profileUser.coverPic
                  : PF + "Person/noCover.jpg"
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <div className="absolute top-[175px] left-1/2 transform -translate-x-1/2 flex flex-col justify-start items-center">
            <div
              className="relative h-[150px] w-[150px] border-[3px] border-white  rounded-full md:h-[200px] md:w-[200px]"
              style={{
                backgroundImage: `url(${
                  profileUser.profilePic
                    ? PF + "Person/" + profileUser.profilePic
                    : PF + "Person/noAvatar.jpg"
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {username !== currentUser.username && (
                <svg
                  className="absolute top-0 left-0 h-[209px] w-[209px] transform -translate-y-[8px] -translate-x-[8px] rotate-[90deg]"
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  viewBox="0 0 160 160"
                >
                  <defs>
                    <linearGradient id="GradientColor">
                      <stop offset="0%" stopColor="#0079ff" />
                      <stop offset="100%" stopColor="#0086ff" />
                    </linearGradient>
                  </defs>

                  <circle
                    className={`fill-none stroke-[3px] ${
                      !followed ? "loading-end" : "loading-start"
                    } `} // No fill, 5px stroke
                    cx="80"
                    cy="80"
                    r="75"
                    strokeLinecap="round"
                    stroke="url(#GradientColor)"
                    strokeDasharray="472"
                    strokeDashoffset="472"
                  />
                </svg>
              )}

              {username !== currentUser.username && (
                <div
                  onClick={handleFollow}
                  className="absolute left-1/2 bottom-[-15px] transform -translate-x-1/2 cursor-pointer w-10 h-10 bg-white rounded-full flex justify-center items-center"
                >
                  <i className="text-xl ri-user-follow-line"></i>
                </div>
              )}
            </div>

            <h1 className="text-xl font-semibold mt-3 md:text-2xl">
              {profileUser.username}
            </h1>
            <p className="text-sm md:text-base">{profileUser.bio}</p>
          </div>
        </div>
      )}

      {/* Feed and User Info */}
      <div className="flex flex-col-reverse lg:flex-row mx-auto justify-center gap-6 px-6 mt-[210px] max-w-7xl">
        <div className="flex-grow">
          <Feed
            username={username}
            UserPhoto={UserPhoto}
            mainItems={mainItems}
            SeperatingLine={SeperatingLine}
          />
        </div>
        <UserInfo Friends={Friends} profileUser={profileUser} />
      </div>
    </div>
  );
}

export default User;

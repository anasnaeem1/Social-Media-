import Feed from "../../Home/feed/feed";
// import noAvatar from "../../../../assets/noAvatar.jpg";
// import noCover from "../../../../assets/noCover.jpg";
import UserInfo from "./userInfo";

function User({ username, user, UserPhoto, mainItems, SeperatingLine }) {
  const { Friends } = mainItems;
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;

  return (
    <div className="flex-[7]">
      {/* Cover and Profile Picture */}
      <div className="relative">
        <div
          className="h-[300px] rounded-md mx-auto max-w-7xl w-full"
          style={{
            backgroundImage: `url(${
              PF + user.coverPic || PF + "Person/noCover.jpg"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="absolute top-[175px] left-1/2 transform -translate-x-1/2 flex flex-col justify-start items-center">
          <div
            className="h-[150px] w-[150px] rounded-full border-[3px] border-white md:h-[200px] md:w-[200px]"
            style={{
              backgroundImage: `url(${
                user.profilePic
                  ? PF + "Person/" + user.profilePic
                  : PF + "Person/noAvatar.jpg"
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <h1 className="text-xl font-semibold mt-3 md:text-2xl">
            {user.username}
          </h1>
          <p className="text-sm md:text-base">{user.bio}</p>
        </div>
      </div>

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
        <UserInfo Friends={Friends} user={user} />
      </div>
    </div>
  );
}

export default User;

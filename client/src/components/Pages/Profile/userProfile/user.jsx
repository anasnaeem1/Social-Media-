// import Cpost from "../../Home/feed/createPost/cPost";
// import post from "../../Home/feed/post/post";
import coverImg from "../../../../assets/cover.png";
import Feed from "../../Home/feed/feed";
import noAvatar from "../../../../assets/noAvatar.jpg";
import noCover from "../../../../assets/noCover.jpg";

// import User from "../../../../assets/user.jpg";
import { useState, useEffect } from "react";
import axios from "axios";


function user({ UserPhoto, mainItems, SeperatingLine }) {
  const { Friends } = mainItems;
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/users?username=Mark`
        );

        setUser(res.data);
        console.log(res.data);
      } catch (error) {
        console.log("Error at fetching", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <div className="flex-[7]">
        {/* Profile Photo and Cover Photo */}
        <div className="relative">
          {/* Cover Image */}
          <div
            className="h-[300px] rounded-md mx-auto max-w-7xl w-full"
            style={{
              backgroundImage: `url(${user.coverImg || noCover})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          ></div>

          {/* Profile Picture and Details */}
          <div className="absolute top-[175px] left-1/2 transform -translate-x-1/2 flex flex-col justify-start items-center">
            <div
              className="h-[150px] w-[150px] rounded-full border-[3px] border-white md:h-[200px] md:w-[200px]"
              style={{
                backgroundImage: `url(${user.profilePicture || noAvatar})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
            <h1 className="text-xl font-semibold mt-3 md:text-2xl">
              {user.username}
            </h1>
            <p className="text-sm md:text-base">{user.bio}</p>
          </div>
        </div>

        {/* FEED AND INFO */}
        <div className="flex flex-col-reverse lg:flex-row justify-center gap-6 px-6 my-[210px] max-w-7xl mx-auto">
          {/* CREATE POST AND FEED */}
          <div className="flex-grow">
            <Feed
              username="Mark"
              UserPhoto={UserPhoto}
              mainItems={mainItems}
              SeperatingLine={SeperatingLine}
            />
          </div>

          {/* USER INFO AND FRIENDS */}
          <div className="w-full lg:w-[400px] flex flex-col gap-4">
            {/* USER INFO */}
            <div className="bg-white rounded-lg p-4">
              <h1 className="text-lg font-semibold border-b pb-2 mb-4">
                User Information
              </h1>
              <div className="flex flex-col gap-3">
                {/* City */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">City:</span>
                  <span className="text-gray-600 font-medium">Karachi</span>
                </div>
                {/* From */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">From:</span>
                  <span className="text-gray-600 font-medium">Aura</span>
                </div>
                {/* Relationship */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">
                    Relationship:
                  </span>
                  <span className="text-gray-600 font-medium">Single</span>
                </div>
              </div>
            </div>

            {/* USER FRIENDS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Friends.map((Friend, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center gap-2 text-center ${
                    index >= 4 ? "hidden sm:block" : "" // Show only first 4 on small screens, all on larger ones
                  }`}
                >
                  <img
                    src={Friend.pic}
                    alt={`${Friend.fname} ${Friend.lname}`}
                    className="rounded-md w-full aspect-square object-cover"
                  />
                  <div>
                    <span className="text-gray-600 text-sm font-medium">
                      {Friend.fname}
                    </span>{" "}
                    <span className="text-sm">{Friend.lname}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default user;

import { useContext, useEffect, useState } from "react";
import Mutuals from "../Mutuals/mutuals";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import { getBirthdayFriends } from "../../../../apiCalls";

function Others({ mainItems }) {
  // const PF = import.meta.env.VITE_PUBLIC_FOLDER || "/images/";
  const { user, dispatch, birthdayFriends: friends } = useContext(UserContext);
  const [birthdayFriends, setBirthdayFriends] = useState([]);

  useEffect(() => {
    if (user._id) {
      const fetchFriends = async () => {
        try {
          if (friends.length > 0) {
            setBirthdayFriends(friends);
            return;
          } else {
            const birthdayFriendsRes = await getBirthdayFriends(user?._id);
            if (birthdayFriendsRes && Array.isArray(birthdayFriendsRes)) {
              const shuffledFriends = birthdayFriendsRes.sort(
                () => Math.random() - 0.5
              );
              setBirthdayFriends(shuffledFriends);
              dispatch({
                type: "UPDATEBIRTHDAYFRIENDS",
                payload: shuffledFriends,
              });
            }
          }
        } catch (error) {
          console.log("Error fetching friends:", error);
        }
      };
      fetchFriends();
    }
  }, [user]);

  return (
    <>
      <div
        style={{ height: "calc(100vh - 65px)" }}
        className="hidden others-container lg:block relative w-full max-w-[350px]"
      >
        {/* Main Wrapper for the Sidebar */}
        <div className="hidden lg:block others-container fixed right-0 top-[65px] custom-scrollbar overflow-y-scroll">
          <div className="flex flex-col gap-5 w-full mx-auto">
            {/* Birthday Section */}
            {Array.isArray(birthdayFriends) && birthdayFriends.length > 0 && (
              <>
                <div className="flex mt-4 items-center gap-3 px-2 py-2 rounded-lg shadow-md w-full bg-white border border-gray-200">
                  {/* Gift Image */}
                  <img
                    src="https://res.cloudinary.com/datcr1zua/image/upload/v1738545241/uploads/eidjo4mpfimaifk2wxdu.avif"
                    alt="Birthday Gift"
                    className="w-[20%] sm:w-[22%] md:w-[25%] max-w-[20%] h-auto object-contain transform -rotate-6 rounded-full"
                  />

                  {/* Birthday Text */}
                  <span className="text-gray-800 text-sm md:text-md leading-snug break-words">
                    <span className="font-semibold text-blue-600">
                      {birthdayFriends.length === 1 ? `Only ` : ""}
                      {birthdayFriends[0].fullname}
                    </span>{" "}
                    <span className="font-semibold text-blue-600">
                      {birthdayFriends.length - 1 > 0
                        ? `and ${birthdayFriends.length - 1} other friend${
                            birthdayFriends.length - 1 > 1 ? "s" : ""
                          }`
                        : ""}
                    </span>{" "}
                    <span className="text-gray-700">
                      have a birthday today.
                    </span>{" "}
                    🎉
                  </span>
                </div>

                {/* Birthday Image Section */}
                {false && (
                  <div className="flex justify-center items-center">
                    <div
                      className="relative w-full h-[250px] rounded-xl bg-cover bg-center overflow-hidden"
                      style={{
                        backgroundImage: `url(${"https://res.cloudinary.com/datcr1zua/image/upload/v1738545416/uploads/haoudkdk9urtk7nmpl3m.avif"})`,
                      }}
                    >
                      {/* Overlay */}
                      <div className="absolute w-full h-full bg-black opacity-40 rounded-xl"></div>

                      {/* Text on the Image */}
                      <div className="absolute top-[50%] left-5 transform -translate-y-1/2 text-gray-200 font-extrabold text-3xl md:text-4xl">
                        <span className="block font-[Montserrat]">Cold</span>
                        <span className="block font-[Montserrat]">Smooth</span>
                        <span className="block font-[Montserrat]">$Tasty</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Friend List Section */}
            <Mutuals mainItems={mainItems} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Others;

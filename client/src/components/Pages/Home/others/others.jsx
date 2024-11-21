import FriendList from "../friendList";

function Others({ mainItems }) {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;

  return (
    <>
      <div className="others-container"></div>
      {/* Main Wrapper for the Sidebar */}
      <div className="fixed right-0 top-[65px] custom-scrollbar overflow-y-auto others-container">
        <div className="flex flex-col  gap-5">
          {/* Birthday Section */}
          <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg shadow-sm">
            <img
              src={PF + "birthdayGift.png"}
              alt="Birthday Gift"
              className="w-[3.5rem] h-[3.5rem] rounded-full border border-gray-300"
            />
            <span className="text-md">
              <span className="font-semibold text-gray-800">Pola Foster</span>{" "}
              and{" "}
              <span className="font-semibold text-gray-800">
                3 other friends
              </span>{" "}
              have a birthday today
            </span>
          </div>

          {/* Birthday Image Section */}
          <div className="flex justify-center items-center">
            <div
              className="relative w-full h-[300px] rounded-xl bg-cover bg-center overflow-hidden"
              style={{ backgroundImage: `url(${PF + "birthday.jpg"})` }}
            >
              {/* Overlay */}
              <div className="absolute w-full h-full bg-black opacity-40 rounded-xl"></div>

              {/* Text on the Image */}
              <div className="z-10 absolute top-[100px] left-3 text-gray-200 font-extrabold text-4xl">
                <span className="block font-[Montserrat]">cold</span>
                <span className="block font-[Montserrat]">smoooth</span>
                <span className="block font-[Montserrat]">$tasty,</span>
              </div>
            </div>
          </div>

          {/* Friend List Section */}
          <div className="mt-4">
            <FriendList mainItems={mainItems} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Others;

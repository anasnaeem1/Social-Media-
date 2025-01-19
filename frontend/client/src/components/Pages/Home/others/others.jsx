import Mutuals from "../../../mutuals";

function Others({ mainItems }) {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER || "/images/";

  return (
    <>
      <div className="others-container"></div>
      {/* Main Wrapper for the Sidebar */}
      <div className="fixed right-0 top-[65px] custom-scrollbar overflow-y-scroll others-container">
        <div className="flex flex-col gap-5 max-w-[400px] w-full mx-auto">
          {/* Birthday Section */}
          <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg shadow-md">
            <img
              src={PF + "birthdayGift.png"}
              alt="Birthday Gift"
              className="w-[3.5rem] h-[3.5rem] rounded-full border border-gray-300"
            />
            <span className="text-sm md:text-md">
              <span className="font-semibold text-gray-800">Pola Foster</span>{" "}
              and{" "}
              <span className="font-semibold text-gray-800">
                3 other friends
              </span>{" "}
              have a birthday today.
            </span>
          </div>

          {/* Birthday Image Section */}
          <div className="flex justify-center items-center">
            <div
              className="relative w-full h-[250px] rounded-xl bg-cover bg-center overflow-hidden"
              style={{ backgroundImage: `url(${PF + "birthday.jpg"})` }}
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

          {/* Friend List Section */}
          <div className="mt-4">
            <Mutuals mainItems={mainItems} />
          </div>
        </div>
      </div>

      {/* Additional Styling for Large Screens */}
      <style>
        {`
          @media (min-width: 1024px) {
            .others-container {
              max-width: 400px;
              margin-right: 1rem;
            }
          }
        `}
      </style>
    </>
  );
}

export default Others;

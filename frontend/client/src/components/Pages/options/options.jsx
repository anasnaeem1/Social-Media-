import { Link } from "react-router-dom";
import FriendList from "../Home/friendList";

function Options({ mainItems, SeperatingLine, userId }) {
  const { Options } = mainItems;

  return (
    <>
      {/* Placeholder div for spacing */}
      <div
        className={`${
          userId ? "hidden lg:block w-[250px]" : "hidden md:block w-[250px]"
        }`}
      ></div>

      {/* Main Options Container */}
      <div
        className={`fixed left-0 top-[65px] custom-width custom-scrollbar overflow-y-scroll ${
          userId
            ? "hidden lg:block lg:w-[250px]"
            : "hidden md:block md:w-[250px]"
        }`}
        style={{ height: "calc(100vh - 65px)" }}
      >
        <div className="pl-4 w-full pt-5 flex flex-col gap-6">
          {/* Options List */}
          <ul className="flex flex-col gap-5">
            {Options.map((option, id) => (
              <Link
                to={option.link}
                key={id}
                className="flex items-center gap-4 group"
              >
                <li
                  className="relative text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-sky-400 to-green-300 
                  text-2xl group-hover:from-green-300 group-hover:via-sky-400 group-hover:to-blue-500 transition duration-300"
                  style={{ WebkitTextFillColor: "transparent" }}
                >
                  {option.icon}
                </li>
                <span className="text-gray-700 text-lg group-hover:text-blue-500 transition duration-300">
                  {option.label}
                </span>
              </Link>
            ))}
            <button className="py-2 px-8 bg-gray-200 text-sm border border-gray-300 rounded-lg hover:bg-gray-300 hover:border-gray-400 transition duration-300">
              Show More
            </button>
          </ul>

          {/* Separator */} 
          <SeperatingLine color={"border-gray-300"} />

          {/* Friend List */}
          <FriendList />
        </div>
      </div>
    </>
  );
}

export default Options;

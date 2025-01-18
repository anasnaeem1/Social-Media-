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
        } `}
      ></div>

      {/* Main Options Container */}
      <div
        className={`fixed left-0 top-[65px] custom-width custom-scrollbar overflow-y-scroll flex-shrink ${
          userId
            ? "hidden lg:block lg:w-[250px] lg:flex-shrink-0"
            : "hidden md:block md:w-[250px] md:flex-shrink"
        }`}
        style={{ height: "calc(100vh - 65px)" }}
      >
        <div className="pl-4 w-full pt-5 flex flex-col gap-6">
          {/* Options List */}
          <ul className="flex justify-center items-start flex-col gap-4">
            {Options.map((option, id) => (
              <Link
                to={option.link}
                key={id}
                className="flex items-center gap-5 pr-4"
              >
                <li className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-sky-400 to-green-300 cursor-pointer text-black text-2xl">
                  {option.icon}
                </li>
                <span className="cursor-pointer text-gray-700 text-lg">
                  {option.label}
                </span>
              </Link>
            ))}
            <button className="py-2 px-8 bg-gray-200 text-sm border border-gray-200">
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

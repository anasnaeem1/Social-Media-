import { navItems } from "../../constants/index.jsx";
import UserPhoto from "../../userPhoto.jsx";
import { Link } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext.jsx"
import Logo from "../../logo.jsx";
// import { useContext } from "react";


function navbar() {
  // const {user} = useContext(AuthContext)
  const { controls, controlsIcons } = navItems;
  return (
    <>
      <div className="w-full h-[65px] "> </div>
      <header
        style={{ fontFamily: "montserrat, sans-serif" }}
        className=" border-b z-[9999] bg-white fixed top-0 text-black w-full flex justify-between items-center px-3 h-[65px]"
      >
        <div>
          <Link to={"/"}>
            <Logo />
          </Link>
        </div>


        {/* Search Bar */}
        <div>
          <i className="flex lg:hidden items-center justify-center ri-search-line text-lg w-11 h-11 bg-BgColor text-white rounded-full"></i>
          <div className="hidden lg:flex  bg-white items-center border border-gray-300 rounded-full px-6 py-2 space-x-2">
            <i className=" ri-search-line text-gray-400"></i>
            <div className="relative">
              <input
                type="search"
                placeholder="Search..."
                className="focus:outline-none text-black bg-transparent transition-all duration-300 ease-in-out w-[250px] focus:w-[300px]"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-5 justify-center items-center">
          {/* Controls */}
          <div>
            <ul className="flex gap-2 text-lg">
              {controls.map((control, index) => {
                return (
                  <div key={index} className="hidden sm:flex">
                    <li className="text-md">{control.label}</li>
                  </div>
                );
              })}
            </ul>
          </div>

          {/* Controls Icons */}
          <div>
            <ul className="flex gap-4 text-xl">
              {controlsIcons.map((icon, index) => {
                return (
                  <li
                    key={index}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-sky-400 to-green-300 text-black cursor-pointer relative text-2xl"
                  >
                    <span>{icon.icon}</span>
                    <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full transform translate-x-1/2 -translate-y-1/2">
                      2
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <UserPhoto />
        </div>
      </header>
    </>
  );
}
export default navbar;

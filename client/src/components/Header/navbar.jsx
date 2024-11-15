import { navItems } from "../../constants/index.jsx";
import UserPhoto from "../../user.jsx";

import Logo from "../../logo.jsx";

function navbar() {  const { controls, controlsIcons } = navItems;
  return (
    <>
    <div className="w-full h-[70px]"> </div>
    <header
      style={{ fontFamily: "montserrat, sans-serif" }}
      className=" bg-BgColor fixed top-0 text-white w-full  flex justify-between items-center px-8 h-[70px]"
    >
      <div>
        <Logo />
      </div>

      {/* Search Bar */}
      <div className="flex bg-white items-center border border-gray-300 rounded-full px-6 py-2 space-x-2">
        <i className="ri-search-line text-gray-400"></i>
       <div className="relative">
  <input
    type="search"
    placeholder="Search..."
    className="focus:outline-none text-black bg-transparent transition-all duration-300 ease-in-out w-[250px] focus:w-[300px]"
  />
</div>

      </div>

      <div className="flex gap-10 justify-center items-center">
        {/* Controls */}
        <div>
          <ul className="flex gap-2 text-lg">
            {controls.map((control, index) => {
              return (
                <li key={index} className="text-md">
                  {control.label}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Controls Icons */}
        <div>
          <ul className="flex gap-4 text-xl">
            {controlsIcons.map((icon, index) => {
              return (
                <li key={index} className="relative text-2xl">
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

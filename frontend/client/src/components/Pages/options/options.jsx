import { Link, useLocation, useNavigate } from "react-router-dom";
import UsersList from "../Home/UsersLists/usersList";
import UserPhoto from "../../userPhoto";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import friendsPage from "../Home/friendsPage/friendsPage";

function Options({ mainItems, userId }) {
  const { Options } = mainItems;
  const { user } = useContext(UserContext);
  const [options, setOptions] = useState([]);
  const [defaultOptions, setDefaultOptions] = useState(false);
  const [friendsOptions, setFriendsOptions] = useState(false);
  const [userLists, setUserLists] = useState(false);
  const Navigate = useNavigate();
  const location = useLocation();
  const isFriendsListPage = location.pathname.startsWith("/friends/list");
  const isBirthdayPage = location.pathname.startsWith("/friends/birthdays");
  const isFriendsPage = location.pathname === "/friends";
  const isSearchPage = location.pathname === "/search";
  const isSettingPage = location.pathname === "/settings";
  const isHomePage = location.pathname === "/";
  const isFriendsRequestPage =
    location.pathname.startsWith("/friends/requests");

  // useEffect(() => {
  //   console.log("We are on the friends page", isFriendsPage);
  //   console.log("We are on the friends request page", isFriendsRequestPage);
  //   console.log("We are on the home page", isHomePage);
  //   console.log("We are on the profile page", userId);
  //   console.log("We are on the bithday page", isBirthdayPage);
  //   console.log("We are on the search page", isSearchPage);
  //   console.log("search ended");
  // }, [isFriendsPage, isFriendsRequestPage, location.pathname]);

  const menuButtonsForHome = [
    {
      label: "Friends",
      enable: false,
      id: 1,
      icon: <i className="text-xl ri-group-fill text-gray-700"></i>,
      path: "/friends",
    },
    {
      label: "Settings",
      enable: false,
      id: 2,
      icon: <i className="text-xl ri-settings-2-fill text-gray-700"></i>,
      path: "/settings",
    },
    {
      label: "Birthdays",
      enable: false,
      id: 3,
      icon: (
        <i
          className="text-xl
      ri-cake-2-fill text-gray-700"
        ></i>
      ),
      path: "/friends/birthdays",
    },
  ];

  const menuButtonsForFriendsPage = [
    {
      label: "Home",
      id: 1,
      icon: <i className="text-xl ri-group-fill text-gray-700"></i>,
      path: "/friends ",
    },
    {
      label: "Friend Requests",
      id: 2,
      icon: <i className="ri-bookmark-fill text-xl text-gray-700"></i>,
      path: "/friends/requests",
    },
    {
      label: "Friend List",
      id: 3,
      icon: <i className="text-xl ri-cake-2-fill text-gray-700"></i>,
      path: "/friends/list",
    },
    {
      label: "Birthdays",
      id: 4,
      icon: <i className="text-xl ri-cake-2-fill text-gray-700"></i>,
      path: "/friends/birthdays",
    },
  ];

  // const friendsList = [
  //   {
  //     DOB: "2005/2/17",
  //     coverPic: "",
  //     createdAt: "2024-12-18T20:09:54.641Z",
  //     email: "william@gmail.com",
  //     followers: (2)[("672fe575d7b36aee33725e76", "673a3277a42f1c300d399772")],
  //     followings: ["672fe575d7b36aee33725e76"],
  //     fullname: "Anas Naeem",
  //     isAdmin: false,
  //     password: "$2b$10$GN/QCh9pPsi0G2iP2uEQc.XT6G9WHgeOjvwnJeFLhIWtzmmcxoVB2",
  //     profilePic:
  //       "https://res.cloudinary.com/datcr1zua/image/upload/v1738549742/uploads/mtfwareigpkkhjis6nc4.jpg",
  //     updatedAt: "2025-02-28T10:36:19.616Z",
  //     username: "anasnaeem112",
  //     __v: 0,
  //     _id: "67632c1229d25b04fd5dbdfc",
  //   },
  //   {
  //     DOB: "2005/2/17",
  //     coverPic: "",
  //     createdAt: "2024-12-18T20:09:54.641Z",
  //     email: "william@gmail.com",
  //     followers: (2)[("672fe575d7b36aee33725e76", "673a3277a42f1c300d399772")],
  //     followings: ["672fe575d7b36aee33725e76"],
  //     fullname: "Anas Naeem",
  //     isAdmin: false,
  //     password: "$2b$10$GN/QCh9pPsi0G2iP2uEQc.XT6G9WHgeOjvwnJeFLhIWtzmmcxoVB2",
  //     profilePic:
  //       "https://res.cloudinary.com/datcr1zua/image/upload/v1738549742/uploads/mtfwareigpkkhjis6nc4.jpg",
  //     updatedAt: "2025-02-28T10:36:19.616Z",
  //     username: "anasnaeem112",
  //     __v: 0,
  //     _id: "67632c1229d25b04fd5dbdfc",
  //   },
  //   {
  //     DOB: "2005/2/17",
  //     coverPic: "",
  //     createdAt: "2024-12-18T20:09:54.641Z",
  //     email: "william@gmail.com",
  //     followers: (2)[("672fe575d7b36aee33725e76", "673a3277a42f1c300d399772")],
  //     followings: ["672fe575d7b36aee33725e76"],
  //     fullname: "Anas Naeem",
  //     isAdmin: false,
  //     password: "$2b$10$GN/QCh9pPsi0G2iP2uEQc.XT6G9WHgeOjvwnJeFLhIWtzmmcxoVB2",
  //     profilePic:
  //       "https://res.cloudinary.com/datcr1zua/image/upload/v1738549742/uploads/mtfwareigpkkhjis6nc4.jpg",
  //     updatedAt: "2025-02-28T10:36:19.616Z",
  //     username: "anasnaeem112",
  //     __v: 0,
  //     _id: "67632c1229d25b04fd5dbdfc",
  //   },
  // ];

  useEffect(() => {
    if (
      !isFriendsListPage &&
      !isFriendsRequestPage &&
      !isFriendsPage &&
      !isBirthdayPage
    ) {
      setOptions(menuButtonsForHome);
      setDefaultOptions(true);
      setFriendsOptions(false);
    } else if (isFriendsPage || isBirthdayPage) {
      setOptions(menuButtonsForFriendsPage);
      setFriendsOptions(true);
      setUserLists(false);
    }
  }, [
    isFriendsListPage,
    isBirthdayPage,
    isFriendsPage,
    isSearchPage,
    isHomePage,
    isFriendsRequestPage,
  ]);

  useEffect(() => {
    if (isFriendsRequestPage || isFriendsListPage) {
      setFriendsOptions(true);
      setUserLists(true);
    }
  }, [isFriendsListPage, isFriendsRequestPage]);

  return (
    <>
      {/* Sidebar Container */}
      <div
        className={` ${
          !friendsOptions
            ? "hidden lg:block"
            : friendsOptions
            ? "w-[350px]"
            : "w-[260px]"
        } ${
          userId
            ? "hidden lg:block"
            : (!userId && !isFriendsRequestPage && friendsOptions) ||
              (isHomePage && "hidden md:block")
        } border transition-all duration-300`}
        style={{ height: "calc(100vh - 65px)" }}
      >
        <div
          className={`${
            friendsOptions ? "px-[174px]" : "px-[130px]"
          } transition-all duration-300`}
        ></div>
      </div>

      {/* Main Options Container */}
      <div
        className={`fixed bg-white left-0 top-[65px] custom-scrollbar transition-all duration-300 overflow-y-scroll ${
          !friendsOptions
            ? "lg:block hidden"
            : "w-[260px]"
        }  ${friendsOptions ? "w-[350px]" : "w-[260px]"} ${
          userId
            ? "hidden lg:block"
            : (!userId && !isFriendsRequestPage && friendsOptions) ||
              (isHomePage && "hidden md:block")
        } border-r`}
        style={{ height: "calc(100vh - 65px)" }}
      >
        <div className="w-full pt-5 flex flex-col gap-6">
          {/* Options List */}
          {false && (
            <ul className="flex flex-col gap-5">
              {Options.map((option, id) => (
                <Link
                  to={option.link}
                  key={id}
                  className="flex items-center gap-4 group hover:bg-gray-50 rounded-lg p-3 transition duration-300"
                >
                  <li className="text-2xl text-black group-hover:text-gray-700 transition duration-300">
                    {option.icon}
                  </li>
                  <span className="text-gray-700 text-lg group-hover:text-gray-700 transition duration-300">
                    {option.label}
                  </span>
                </Link>
              ))}
              <button className="py-2 px-8 bg-gray-100 text-sm border border-gray-200 rounded-lg hover:bg-gray-200 hover:border-gray-300 transition duration-300">
                Show More
              </button>
            </ul>
          )}

          {/* Main Content Section */}
          <div className="w-full flex flex-col gap-4">
            {/* User Info Section */}
            {friendsOptions ? (
              <div className="relative flex rounded-lg p-3 items-center justify-between bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                {/* Back Button */}
                <div
                  onClick={() => Navigate(-1)}
                  className="flex justify-center items-center h-10 w-10 bg-gray-100 rounded-full hover:bg-gray-200 transition duration-300 cursor-pointer group"
                >
                  <i className="ri-arrow-left-line text-xl text-gray-600 group-hover:text-gray-800 transition duration-300"></i>
                </div>

                {/* Friends Heading */}
                <div
                  className={`${
                    userLists ? "justify-start" : "justify-center"
                  } flex-1 flex items-center relative`}
                >
                  {/* "Friends" Heading */}
                  <h1
                    className={`${
                      userLists
                        ? "absolute left-[20px] -top-2 text-sm text-gray-500"
                        : "text-lg text-gray-800"
                    } font-semibold transition-all duration-300`}
                  >
                    Friends
                  </h1>
                  {/* "Friend Requests" Heading */}
                  {userLists && (
                    <h1 className="font-semibold px-5  transform translate-y-2 text-lg text-gray-800 transition-all duration-300">
                      Friend{" "}
                      {isFriendsRequestPage
                        ? "Requests"
                        : isFriendsListPage && "List"}
                    </h1>
                  )}
                </div>

                {/* Settings Button */}
                {isFriendsPage && (
                  <div className="flex justify-center items-center h-10 w-10 bg-gray-100 rounded-full hover:bg-gray-200 transition duration-300 cursor-pointer group">
                    <i className="ri-settings-2-fill text-xl text-gray-600 group-hover:text-gray-800 transition duration-300"></i>
                  </div>
                )}
              </div>
            ) : (
              <div
                onClick={() =>
                  Navigate(`${userId ? "/" : `/profile/${user._id}`}`)
                }
                className="flex rounded-lg py-2 px-3 transition-all ease-in-out duration-100 hover:bg-gray-50 items-center justify-start hover:cursor-pointer gap-3 border border-gray-100 hover:border-gray-200"
              >
                <UserPhoto userId={user._id} user={user} />
                <h1 className="font-semibold text-lg text-gray-800">
                  {user.fullname}
                </h1>
              </div>
            )}
            {/* Menu Buttons Section */}
            {userLists && !isHomePage ? (
              <UsersList
                isFriendsRequestPage={isFriendsRequestPage}
                isFriendsListPage={isFriendsListPage}
              />
            ) : (
              (defaultOptions || options) &&
              Array.isArray(menuButtonsForHome) &&
              Array.isArray(menuButtonsForFriendsPage) &&
              options.map((item) => (
                <div
                  onClick={() => Navigate(item.path)}
                  key={item.id}
                  className={`${
                    isFriendsPage && item.label === "Home"
                      ? "bg-blue-50 border-blue-200" // Selected state styling
                      : "bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50 " // Default state styling
                  } flex rounded-lg p-3 transition-all duration-300 items-center group justify-start cursor-pointer gap-3 border `}
                >
                  <li
                    className={`flex justify-center items-center h-10 w-10 rounded-lg ${
                      isFriendsPage && item.label === "Home"
                        ? "bg-gradient-to-r from-gray-200 to-gray-300" // Selected icon background (light gray)
                        : "bg-gradient-to-r from-gray-100 to-gray-200" // Default icon background (lighter gray)
                    }`}
                  >
                    {item.icon}
                  </li>
                  <h1
                    className={`font-medium  ${
                      isFriendsPage && item.label === "Home"
                        ? "text-blue-700" // Selected text color
                        : "text-gray-700" // Default text color
                    }`}
                  >
                    {item.label}
                  </h1>
                </div>
              ))
            )}
          </div>

          {/* Separator (Optional) */}
          {/* <div className="border-t border-gray-200 my-4"></div> */}

          {/* Friend List (Optional) */}
        </div>
      </div>
    </>
  );
}

export default Options;

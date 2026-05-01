import React, { createContext, useMemo } from "react";
import { useLocation } from "react-router-dom";

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
      <i className="text-xl ri-cake-2-fill text-gray-700"></i>
    ),
    path: "/friends/birthdays",
  },
];

const menuButtonsForFriendsPage = [
  {
    label: "Home",
    id: 1,
    icon: <i className="text-xl ri-group-fill text-gray-700"></i>,
    path: "/friends",
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

export const sidebarContext = createContext({
  currentPath: "/",
  sidebarPage: "home",
  buttons: { path: "/", buttons: menuButtonsForHome },
});

export const SidebarContextProvider = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname || "/";

  // A single "what page is this" key for the sidebar.
  // This keeps `sidebar.jsx` simple: it can branch off one value instead of many URL checks.
  const sidebarPage = (() => {
    if (currentPath.startsWith("/friends/requests")) return "friendsRequests";
    if (currentPath.startsWith("/friends/list")) return "friendsList";
    if (currentPath.startsWith("/friends/birthdays")) return "friendsBirthdays";
    if (currentPath === "/friends") return "friendsHome";
    if (currentPath.startsWith("/profile/")) return "profile";
    return "home";
  })();

  const buttonsArray =
    sidebarPage.startsWith("friends") ? menuButtonsForFriendsPage : menuButtonsForHome;

  const value = useMemo(() => {
    return {
      currentPath,
      sidebarPage,
      buttons: {
        path: currentPath,
        buttons: buttonsArray,
      },
    };
  }, [
    currentPath,
    sidebarPage,
    buttonsArray,
  ]);

  return <sidebarContext.Provider value={value}>{children}</sidebarContext.Provider>;
};


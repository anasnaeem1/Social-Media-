// import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import ExploreUsers from "./exploreUsers/exploreUsers";
import { useEffect, useState, useContext, useRef } from "react";
import { UserContext } from "../../../context/UserContext";
import { useLocation } from "react-router-dom";
import UsersBirthdaysPage from "./usersBirtdaysPage/usersBirthdaysPage";
import { getAllUsers } from "../../../../apiCalls";

function friendsPage() {
  const location = useLocation();
  const { user: currentUser } = useContext(UserContext);
  const [followRequestUsers, setFollowRequestUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const isFriendsListPage = location.pathname.startsWith("/friends/list");
  const isBirthdayPage = location.pathname.startsWith("/friends/birthdays");
  const isFriendsPage = location.pathname === "/friends";
  const isSearchPage = location.pathname === "/search";
  const isHomePage = location.pathname === "/";
  const isFriendsRequestPage =
    location.pathname.startsWith("/friends/requests");

  useEffect(() => {
    if (currentUser._id) {
      setUsersLoading(true);
      const fetchFollowRequestUsers = async () => {
        try {
          const followRequestUsersRes = await axios.get(
            `/api/users/followRequests/${currentUser._id}`
          );
          const allUsersRes = await getAllUsers(currentUser._id)
          const followRequestUsers = followRequestUsersRes.data;

          const filteredUsers = allUsersRes.filter(
            (user) =>
              !followRequestUsers.some(
                (followUser) => followUser?._id === user?._id
              )
          );
          setAllUsers(filteredUsers);
          setFollowRequestUsers(followRequestUsers);
          setUsersLoading(false);
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
      };
      fetchFollowRequestUsers();
    }
  }, [currentUser._id]);

  return (
    <div
      className={`${
        isFriendsRequestPage || isFriendsListPage ? "items-center justify-center" : "justify-start"
      } w-full xl:max-w-full bg-gray-50 flex-col items-center friendsPageContainer  md:px-3 px-0 max-w-[1200px] flex`}
    >
      {isBirthdayPage ? (
        <UsersBirthdaysPage/>
      ) : isFriendsRequestPage || isFriendsListPage ? (
        <div className="flex flex-col items-center justify-center">
          {/* Image Section */}
          <div
            className="max-w-[360px] w-full h-[250px] bg-cover bg-center overflow-hidden rounded-lg"
            style={{
              backgroundImage: `url(${"https://res.cloudinary.com/datcr1zua/image/upload/v1741051663/uploads/mynakqwx8ap1am70fwqq.png"})`,
            }}
          ></div>

          {/* Heading */}
          <h1 className="font-semibold text-xl text-gray-600 mt-4 text-center">
            Select people's names to preview their profile.
          </h1>
        </div>
      ) : (
        <>
          {" "}
          <div className="md:px-2 px-0 py-2 gap-2 w-full flex flex-col">
            <h1 className="text-black font-semibold px-2 py-2">
              Follow Requests
            </h1>
            <ExploreUsers
              followReq={true}
              users={followRequestUsers}
              usersLoading={usersLoading}
            />
          </div>
          <div className="px-2 py-2 gap-2 w-full flex flex-col">
            <h1 className="text-black font-semibold px-2 py-2">
              People you may know
            </h1>
            <ExploreUsers
              allUsers={true}
              users={allUsers}
              usersLoading={usersLoading}
            />
          </div>
        </>
      )}
    </div>
  );
}
export default friendsPage;

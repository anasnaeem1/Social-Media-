// import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import { Link } from "react-router-dom";
import ExploreUsers from './exploreUsers/exploreUsers'
import { useEffect, useState, useContext, useRef } from "react";
import { UserContext } from "../../../context/UserContext";

function friendsPage() {
  const { user: currentUser } = useContext(UserContext);
  const [followRequestUsers, setFollowRequestUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  useEffect(() => {
    if (currentUser._id) {
      setUsersLoading(true);
      const fetchFollowRequestUsers = async () => {
        try {
          const followRequestUsersRes = await axios.get(
            `/api/users/followRequests/${currentUser._id}`
          );
          const allUsersRes = await axios.get(
            `/api/users/allUsers`
          );
          setAllUsers(allUsersRes.data)
          setFollowRequestUsers(followRequestUsersRes.data);
          setUsersLoading(false);
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
      };
      fetchFollowRequestUsers();
    }
  }, [currentUser]);

  return (
    <div className="w-full flex-col friendsPageContainer max-w-[1100px] flex">
      <div className="px-2 py-2 gap-2 w-full flex flex-col">
        <h1 className="text-black font-semibold">Follow Requests</h1>
        <ExploreUsers followReq={true} users={followRequestUsers} usersLoading={usersLoading}/>
      </div>
      <div className="px-2 py-2 gap-2 w-full flex flex-col">
        <h1 className="text-black font-semibold">People you may know</h1>
        <ExploreUsers allUsers={true} users={allUsers} usersLoading={usersLoading}/>
      </div>
    </div>
  );
}
export default friendsPage;

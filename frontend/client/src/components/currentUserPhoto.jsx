// import User from "./assets/user.jpg";
import { useContext } from "react";
// import noAvatar from "./assets/noAvatar.jpg";
import { UserContext } from "./context/UserContext";
import { Link } from "react-router-dom";

function user() {
  const { user } = useContext(UserContext);

  return (
    <Link to={user ? "/profile/" + user._id : undefined}>
      <img
        src={user?.profilePic || "noAvatar.png"}
        alt="User Avatar"
        className="w-[50px] h-[50px] rounded-full object-cover"
      />
    </Link>
  );
}
export default user;

// import User from "./assets/user.jpg";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import { Link } from "react-router-dom";

function user() {
  const { user } = useContext(UserContext);

  return (
    <Link to={`/profile/${user._id}`}>
    <div className="relative w-[58px] h-[58px] border-[3px] border-white rounded-full overflow-hidden">
      <img
        src={
          user?.profilePic
            ? user?.profilePic
            : "https://res.cloudinary.com/datcr1zua/image/upload/v1739709690/uploads/rindbm34tibrtqcgvpsd.png"
        }
        alt="lol"
        className="w-full h-full object-cover"
      />
    </div>
  </Link>
  );
}
export default user;

// import User from "./assets/user.jpg";
import { useContext } from "react";  
// import noAvatar from "./assets/noAvatar.jpg";
import { UserContext } from "./context/UserContext";
import { Link } from "react-router-dom";

function user() {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER || "/images/";
  const { user } = useContext(UserContext);

  return (
    <Link to={user ? "/profile/" + user._id : undefined}>
      <div
        className={` w-[50px] h-[50px] bg-cover bg-no-repeat rounded-full`}
        style={{
          backgroundImage: `url(${
            user
              ? user.profilePic
                ? `${PF}/${user.profilePic}`
                : `${PF}/noAvatar.png`
              : undefined
          })`,
          opacity: 1,
        }}
      ></div>
    </Link>
  );
}
export default user;

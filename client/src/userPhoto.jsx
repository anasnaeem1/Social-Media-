// import User from "./assets/user.jpg";
import { useContext } from "react";
// import noAvatar from "./assets/noAvatar.jpg";
import { AuthContext } from "./components/context/AuthContext";
import { Link } from "react-router-dom";

function user() {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const { user } = useContext(AuthContext);
  console.log(user)
  return (
    <Link to={"/profile/" + user.username}>
      <div
        className=" w-[50px] h-[50px] bg-cover bg-no-repeat rounded-full"
        style={{
          backgroundImage: `url(${
            user.profilePic
              ? PF + "Person/" + user.profilePic
              : PF + "Person/noAvatar.jpg"
          })`,
          opacity: 1,
        }}
      ></div>
    </Link>
  );
}
export default user;

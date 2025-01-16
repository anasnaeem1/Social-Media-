import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";
import UserPhoto from "../../userPhoto";

function suggesionBox() {
  const { user } = useContext(UserContext);


  

  return (
    <div
      className="shadow-lg absolute z-10 w-[760px] mx-[255px] bg-white border"
      // style={{
      //   height: "calc(100vh - 70px)",
      // }}
    >
      {!user && (
        <div className="border-b p-2">
          {/* <h1 className="text-blue-500 text-lg font-semibold uppercase">
            Users
          </h1> */}
          <div className="p-4 flex">
            <div className="overflow-hidden mr-4">
              <Link to={`/profile/${user._id}`}>
                <UserPhoto userId={user._id} user={user} />
              </Link>
            </div>

            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-800">
                {user.username}
              </h1>
              <p className="text-sm text-gray-600 mt-1">{user.bio}</p>
            </div>
          </div>
          <div className="p-4 flex">
            <div className="overflow-hidden mr-4">
              <Link to={`/profile/${user._id}`}>
                <UserPhoto userId={user._id} user={user} />
              </Link>
            </div>

            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-800">
                {user.username}
              </h1>
              <p className="text-sm text-gray-600 mt-1">{user.bio}</p>
            </div>
          </div>

          <div className="p-4 flex">
            <div className="overflow-hidden mr-4">
              <Link to={`/profile/${user._id}`}>
                <UserPhoto userId={user._id} user={user} />
              </Link>
            </div>

            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-800">
                {user.username}
              </h1>
              <p className="text-sm text-gray-600 mt-1">{user.bio}</p>
            </div>
          </div>
        </div>
      )}

      <div className="border-b p-2">
        <h1 className="text-blue-500 text-lg font-semibold uppercase">
          Suggesion
        </h1>
        <div className="px-5 py-3 hover:bg-gray-50 flex justify-between">
          <p className="">jana samjho na hum darte hain</p>
          <p className="text-blue-500 cursor-pointer">2 Results</p>
        </div>
        <div className="px-5 py-3 hover:bg-gray-50 flex justify-between">
          <p className="">jana samjho na hum darte hain</p>
          <p className="text-blue-500 cursor-pointer">2 Results</p>
        </div>
        <div className="px-5 py-3 hover:bg-gray-50 flex justify-between">
          <p className="">jana samjho na hum darte hain</p>
          <p className="text-blue-500 cursor-pointer">2 Results</p>
        </div>
      </div>
    </div>
  );
}
export default suggesionBox;

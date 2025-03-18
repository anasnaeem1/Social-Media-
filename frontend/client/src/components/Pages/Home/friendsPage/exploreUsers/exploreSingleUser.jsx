import axios from "axios";
import { useEffect, useState, useContext, useRef } from "react";
import { UserContext } from "../../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import FollowButton from "../../Buttons/followButton";
import UserPhoto from "../../../../userPhoto";

function exploreSingleUser({ user, followReq, allUsers }) {
  const { user: currentUser } = useContext(UserContext);
  const Navigate = useNavigate();

  const handleNavigateToProfile = (e) => {
    e.preventDefault();
    Navigate(`/profile/${user._id}`);
  };

  return (
    <>
      <div
        key={user?._id}
        className="flex py-2 md:py-0 md:flex-col flex-row justify-between md:justify-center items-center bg-white w-full max-w-full md:max-w-[200px]  text-center border rounded-lg hover:shadow-md transition-shadow"
      >
        {!user ? (
          <div
            className={`rounded-t-md w-[200px] h-[200px] bg-gray-300 animate-pulse`}
          ></div>
        ) : (
          <img
            onClick={handleNavigateToProfile}
            src={
              user?.profilePic
                ? `${user?.profilePic}`
                : `https://res.cloudinary.com/datcr1zua/image/upload/v1739709690/uploads/rindbm34tibrtqcgvpsd.png`
            }
            alt={`${user.fname} ${user.lname}`}
            className="md:block hidden cursor-pointer rounded-t-md w-full h-auto object-cover"
            style={{ aspectRatio: "1 / 1" }}
          />
        )}
        <div className="flex w-full max-w-[250px] justify-start">
          <div className="sm:max-w-[70px] max-w-[60px] w-full md:hidden block">
            <UserPhoto userId={user._id} user={user} lg={true} />
          </div>
          <div className="md:py-2 w-full flex items-center justify-start md:justify-center">
            <span className="text-sm sm:text-md font-semibold text-gray-700">
              {user?.fullname}
            </span>
          </div>
        </div>
        {/* Buttons section - Aligned in a column */}
        <div className="flex md:flex-col mr-5 flex-row justify-between md:justify-center md:py-2 md:px-2 w-full md:max-w-full sm:max-w-[200px] max-w-[100px] gap-2">
          <FollowButton
            otherUser={user}
            text={followReq ? "Accept" : "Follow"}
          />
          <button className="border w-full sm:block hidden md:max-w-full max-w-[140px] mr-2 py-2 bg-white text-black text-sm rounded-md hover:bg-gray-100 transition">
            Delete
          </button>
        </div>
      </div>
    </>
  );
}
export default exploreSingleUser;

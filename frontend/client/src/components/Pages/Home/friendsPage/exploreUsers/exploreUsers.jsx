import ExploreSingleUser from "./exploreSingleUser";
import React from "react";

function exploreUsers({ followReq, allUsers, users, usersLoading }) {
  return (
    <div
      className={`${
        users.length <= 4
          ? "md:flex items-start md:gap-4 gap-2 place-items-center md:place-items-start grid-cols-[repeat(auto-fit,minmax(200px,1fr))]"
          : "md:grid flex flex-col gap-2 place-items-center md:place-items-start grid-cols-[repeat(auto-fit,minmax(200px,1fr))]"
      }`}
    >
      {usersLoading ? (
        <>
          {/* Loading Skeletons */}
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-white w-full max-w-[200px] text-center border rounded-lg shadow-sm hover:shadow-md transition-all animate-pulse"
            >
              {/* Image Skeleton */}
              <div className="rounded-t-md w-full h-[207px] bg-gray-200"></div>

              {/* Text Skeleton */}
              <div className="mt-3 px-2 w-full">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
              </div>

              {/* Buttons Skeleton */}
              <div className="flex flex-col w-full gap-2 mt-3 px-2 mb-3">
                <div className="h-8 bg-gray-200 rounded-md"></div>
                <div className="h-8 bg-gray-100 rounded-md"></div>
              </div>
            </div>
          ))}
        </>
      ) : users.length > 0 ? (
        // Render Users
        users.map((user) => (
          <ExploreSingleUser
            key={user._id} // Ensure a unique key
            user={user}
            followReq={followReq}
            allUsers={allUsers}
          />
        ))
      ) : (
        // No Users Found State
        <div className="col-span-full flex flex-col items-center justify-center w-full py-8 text-center">
          {/* Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>

          {/* Message */}
          <p className="text-gray-700 text-lg font-semibold mb-2">
            No {followReq ? "Follow Requests" : allUsers ? "Users" : "Friends"}{" "}
            Found
          </p>
          <p className="text-gray-500 text-sm max-w-md">
            {followReq
              ? "You don't have any follow requests at the moment."
              : allUsers
              ? "It looks like there are no users to display."
              : "You don't have any friends yet."}
          </p>
        </div>
      )}
    </div>
  );
}
export default exploreUsers;

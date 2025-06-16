import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import UserPhoto from "../../../userPhoto";
import { Link } from "react-router-dom";
import { isUserFollowed } from "../../../../apiCalls";
import SingleMutual from "./singleMutual";

function FollowSuggestion() {
  const { user, dispatch } = useContext(UserContext);
  const [mutualFriends, setMutualFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);

  useEffect(() => {
    if (user._id) {
      const fetchFriends = async () => {
        try {
          setLoadingFriends(true);
          const res = await axios.get(`/api/users/mutuals?userId=${user._id}`);
          if (res.data) {
            const sanitizedResponse = res.data.filter(
              (e) => e._id !== user._id
            );
            const filteredMutualFriends = sanitizedResponse.filter(
              (friend) => !friend.isFollowed
            );
            setMutualFriends(filteredMutualFriends);
            setLoadingFriends(false);
          }
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
      };
      fetchFriends();
    }
  }, [user._id]);

  // useEffect(() => {
  //   if (mutualFriends && user) {
  //     const followedUsers = mutualFriends
  //     .filter((friend) => {
  //       const isFollowed = isUserFollowed(user, friend);
  //       return isFollowed;
  //     })
  //     .map((friend) => ({
  //       ...friend,
  //       isFollowed: true, // Add the isFollowed flag
  //     }));

  //     const newMutualFriends = mutualFriends.filter((friend) => {
  //       return !followedUsers.some(
  //         (followedUser) => followedUser._id === friend._id
  //       );
  //     });

  //     setMutualFriends(newMutualFriends);
  //   }
  // }, [user, mutualFriends]);

  return (
    <>
      {
        <div className="mt-6 w-full max-w-md mx-auto bg-white rounded-xl shadow-md border border-gray-300 p-6">
          <h1 className="text-2xl font-semibold text-gray-900 text-center mb-6 border-b pb-3">
            Mutual Friends
          </h1>

          <ul className="flex flex-col gap-5">
            {!loadingFriends ? (
              Array.isArray(mutualFriends) && mutualFriends.length > 0 ? (
                mutualFriends.map((friend) => (
                  <React.Fragment key={friend._id}>
                    <SingleMutual friend={friend} />
                  </React.Fragment>
                ))
              ) : (
                <p className="text-center text-gray-500 text-lg">
                  No mutual friends found
                </p>
              )
            ) : (
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg shadow-sm border border-gray-300 animate-pulse"
                >
                  {/* Avatar Skeleton */}
                  <div className="w-14 h-14 rounded-full bg-gray-400"></div>

                  {/* Text Skeleton */}
                  <div className="flex-1 space-y-2">
                    <div className="w-32 h-5 bg-gray-400 rounded"></div>
                    <div className="w-24 h-4 bg-gray-400 rounded"></div>
                  </div>

                  {/* Button Skeleton */}
                  <div className="w-24 h-9 bg-gray-400 rounded-md"></div>
                </div>
              ))
            )}
          </ul>
        </div>
      }{" "}
    </>
  );
}

export default FollowSuggestion;

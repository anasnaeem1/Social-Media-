import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import * as mainItems from "../../../../../constants/index";
import { Link, useParams } from "react-router-dom";
import { format } from "timeago.js";
// import PostSkeleton from "../../../../Skeleton/postSkeleton";
import { AuthContext } from "../../../../context/AuthContext";
import UserPhoto from "../../../../userPhoto";
import CurrentUserPhoto from "../../../../currentUserPhoto";

function Post({ post }) {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const PA = import.meta.env.VITE_PUBLIC_API;
  const { user } = useContext(AuthContext);
  const { Friends, Shares } = mainItems;
  const [likes, setLikes] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [postUser, setPostUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const [isProcessing, setIsProcessing] = useState(false);

  const likeHandler = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    const userId = user._id;
    try {
      await axios.put(`${PA}/api/posts/${post._id}/like`, {
        userId: userId,
      });
      setLikes(isLiked ? likes - 1 : likes + 1);
      setIsLiked(!isLiked);
    } catch (error) {
      console.log(error);
    }
    setIsProcessing(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${PA}/api/users?userId=${post.userId}`);
        setPostUser(res.data);
        setIsLoading(false);
      } catch (error) {
        console.log("Error fetching user", error);
      }
    };
    fetchUser();
    if (post.likes.includes(user._id)) {
      setIsLiked(true);
    }
  }, [post.userId, post.likes, user._id]);

  return (
    <div className="bg-white mx-2 shadow-md border border-gray-200 rounded-lg flex flex-col gap-3 max-w-[540px] w-full">
      {/* Post Header */}
      <div className="flex px-4 py-3 justify-between items-center">
        <div className="flex items-center gap-3">
          {/* User Photo */}
          {isLoading ? (
            <div className="w-[50px] h-[50px] bg-gray-300 rounded-full animate-pulse"></div>
          ) : params === `/profile/${postUser._id}` ? (
            postUser._id === user._id ? (
              <CurrentUserPhoto />
            ) : (
              <UserPhoto userId={post.userId} user={postUser} />
            )
          ) : postUser._id === user._id ? (
            <CurrentUserPhoto />
          ) : (
            <UserPhoto userId={post.userId} user={postUser} />
          )}

          {/* User Info */}
          <div className="flex flex-col">
            {/* User Info */}
            <div className="flex flex-col">
              {/* Username Skeleton */}
              {isLoading ? (
                <div className="w-[130px] h-[14px] mb-2 bg-gray-300 rounded-md animate-pulse"></div>
              ) : (
                <h1 className="cursor-pointer text-lg font-semibold text-gray-800">
                  {postUser.username}
                </h1>
              )}

              {/* CreatedAt Skeleton */}
              {isLoading ? (
                <div className="w-[100  px] h-[13px] bg-gray-300 rounded-md animate-pulse"></div>
              ) : (
                <span className="cursor-pointer text-sm text-gray-500 mt-1">
                  {" "}
                  {/* Add margin-top to increase spacing */}
                  {format(post.createdAt)}
                </span>
              )}
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="flex justify-center items-center hover:bg-gray-200 w-10 h-10 rounded-full text-xl">
            <i className="ri-more-line"></i>
          </button>
          <button className="flex justify-center items-center hover:bg-gray-200 w-10 h-10 rounded-full text-xl">
            <i className="ri-close-line"></i>
          </button>
        </div>
      </div>

      {/* Post Content */}
      {post?.desc && (
        <div className="px-4 text-md font-medium text-gray-800">
          {post.desc}
        </div>
      )}

      {/* Image Section */}
      {post.img && (
        <div
          className="w-full h-[300px] bg-cover bg-no-repeat bg-center"
          style={{
            backgroundImage: `url(${post.img ? `${PF}/${post.img}` : ""})`,
          }}
        ></div>
      )}

      {/* Like and Comments Section */}
      {likes > 0 && (
        <div className="flex justify-between px-4 py-3 items-center">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xl">
              {likes > 1 && <span>👍</span>}
              {likes > 2 && <span className="text-red-600">❤️</span>}
              {likes > 3 && <span>😂</span>}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <span>{likes}</span>
              <span>people like this</span>
            </div>
          </div>
        </div>
      )}

      {/* Share Buttons Section */}
      <div className="flex justify-around px-4 py-3">
        {Shares.map((share, id) => (
          <button
            key={id}
            onClick={share.id === 1 ? likeHandler : undefined}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all"
          >
            <span
              className={`${
                share.id === 1 && isLiked && "likeAnimate"
              } transition-all duration-300 text-2xl `}
            >
              {share.id === 1 && isLiked ? share.liked : share.icon}
            </span>
            <span className="text-sm font-medium">{share.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default React.memo(Post);

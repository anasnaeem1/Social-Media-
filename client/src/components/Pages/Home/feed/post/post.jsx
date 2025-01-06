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
          <div className="w-[40px] h-[40px] bg-gray-300 rounded-full animate-pulse"></div>
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
        <div>
          {isLoading ? (
            <div className="w-[120px] h-[12px] mb-1 bg-gray-300 rounded-md animate-pulse"></div>
          ) : (
            <h1 className="cursor-pointer text-sm font-semibold text-gray-800">
              {postUser.username}
            </h1>
          )}
  
          {isLoading ? (
            <div className="w-[80px] h-[10px] bg-gray-300 rounded-md animate-pulse"></div>
          ) : (
            <span className="text-xs text-gray-500">{format(post.createdAt)}</span>
          )}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex gap-2">
        <button className="flex justify-center items-center hover:bg-gray-100 w-8 h-8 rounded-full text-xl">
          <i className="ri-more-line"></i>
        </button>
        <button className="flex justify-center items-center hover:bg-gray-100 w-8 h-8 rounded-full text-xl">
          <i className="ri-close-line"></i>
        </button>
      </div>
    </div>
  
    {/* Post Content */}
    {post?.desc && (
      <div className="px-4 text-sm font-medium text-gray-800">{post.desc}</div>
    )}
  
 {/* Image Section */}
{post.img && (
  <Link to={`/photo/${[post.img]}`}>
    <div
      className="w-full h-[240px] bg-cover bg-no-repeat bg-center rounded-md"
      style={{
        backgroundImage: `url(${post.img ? `${PF}${post.img}` : ""})`,
      }}
    ></div>
  </Link>
)}

{/* Like and Comments Section */}
{likes > 0 && (
  <div className="flex items-center justify-between px-4">
    <div className="flex items-center gap-2">
      {/* Emoji Logic */}
      <div className="flex items-center text-base">
        <span className="text-lg">{likes >= 1 && "👍"}</span>
        <span className="text-lg ">{likes >= 2 && "❤️"}</span>
        <span className="text-lg">{likes >= 3 && "😮"}</span>
      </div>
      <span className="text-xs text-gray-600 font-medium">
        {likes === 1 ? "1 person likes this" : `${likes} people like this`}
      </span>
    </div>
    <button className="text-xs text-blue-500 font-medium hover:underline">
      View comments
    </button>
  </div>
)}

  
    {/* Share Buttons Section */}
    <div className="flex justify-around px-4 py-3">
      {Shares.map((share, id) => (
        <button
          key={id}
          onClick={share.id === 1 ? likeHandler : undefined}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-all"
        >
          <span
            className={`${
              share.id === 1 && isLiked && "likeAnimate"
            } transition-all duration-300 text-lg`}
          >
            {share.id === 1 && isLiked ? share.liked : share.icon}
          </span>
          <span className="text-xs font-medium">{share.label}</span>
        </button>
      ))}
      
    </div>
  </div>
  
  );
}

export default React.memo(Post);

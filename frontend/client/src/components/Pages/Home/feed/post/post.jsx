import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import * as mainItems from "../../../../../constants/index";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { format } from "timeago.js";
// import PostSkeleton from "../../../../Skeleton/postSkeleton";
import { UserContext } from "../../../../context/UserContext";
import Comment from "./comments/Comment";
import UserPhoto from "../../../../userPhoto";
// import { submittingComment } from "../../../../../apiCalls";
import CurrentUserPhoto from "../../../../currentUserPhoto";
import { YourNewComment } from "../../../../context/UserActions";
import { useNavigate } from "react-router-dom";
import CommentBox from "./comments/commentBox";

function Post({ post, userId, searchInput }) {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER || "/images/";
  const PA = import.meta.env.VITE_PUBLIC_API;
  const { dispatch, commentBox, user } = useContext(UserContext);
  const { Friends, Shares } = mainItems;
  const [likes, setLikes] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [postUser, setPostUser] = useState({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const { postId } = useParams();

  const shareIcons = [
    {
      id: 1,
      icon: <i className="ri-thumb-up-line"></i>,
      liked: <i className="ri-thumb-up-fill"></i>,
      label: "Like",
      link: "/",
    },
    {
      id: 2,
      icon: <i className="ri-chat-1-line"></i>,
      label: "Comments",
      link: "/",
    },
    {
      id: 3,
      icon: <i className="ri-hashtag"></i>,
      label: "Tag",
      link: "/",
    },
    {
      id: 4,
      icon: <i className="ri-share-forward-line"></i>,
      label: "Share",
      link: "/",
    },
  ];

  const likeHandler = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    const userId = user._id;
    try {
      await axios.put(`/api/posts/${post._id}/like`, {
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
        const res = await axios.get(`/api/users?userId=${post.userId}`);
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

  const handleCommentBox = async (e) => {
    e.preventDefault();
    if (postId && postId === post._id) {
      if (userId) {
        navigate(`/profile/${userId}`);
      } else {
        navigate("/");
      }
      return;
    }
    if (userId) {
      navigate(`/profile/${userId}/${post._id}`);
    } else {
      navigate(`/${post._id}`);
    }
  };

  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;


    const regex = new RegExp(`(${searchTerm})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="text-blue-500">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="bg-white mx-4 shadow-md border border-gray-200 rounded-lg flex flex-col  max-w-[540px] w-full">
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
              <span className="text-xs text-gray-500">
                {format(post.createdAt)}
              </span>
            )}
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex justify-center items-center hover:bg-gray-100 w-8 h-8 rounded-full text-xl">
            <i className="ri-more-line"></i>
          </button>
          <button className="flex justify-center items- center hover:bg-gray-100 w-8 h-8 rounded-full text-xl">
            <i className="ri-close-line"></i>
          </button>
        </div>
      </div>
      {/* Post Content */}
      {post?.desc && (
        <div
          className={`${
            !post.img ? "text-lg py-2 md-text-lg" : "text-sm"
          } px-4 md-text-sm text-start font-medium text-gray-800`}
        >
          {highlightText(post.desc, searchInput)}
        </div>
      )}

      {/* Image Section */}
      {post.img && (
        <Link to={`/photo/${[post.img]}`}>
          <div
            className="mt-3 w-full h-[240px] bg-cover bg-no-repeat bg-center rounded-md"
            style={{
              backgroundImage: `url(${post.img ? `${PF}${post.img}` : ""})`,
            }}
          ></div>
        </Link>
      )}
      {/* Like and Comments Section */}
      {likes > 0 && (
        <div className="flex items-center justify-between py-2 px-4">
          <div className="flex items-center gap-2">
            {/* Emoji Logic */}
            <div className="flex items-center text-base">
              <span className="text-lg">{likes >= 1 && "👍"}</span>
              <span className="text-lg">{likes >= 2 && "❤️"}</span>
              <span className="text-lg">{likes >= 3 && "😮"}</span>
            </div>
            <span className="text-xs text-gray-600 font-medium">
              {likes === 1
                ? "1 person likes this"
                : `${likes} people like this`}
            </span>
          </div>
          <button
            onClick={handleCommentBox}
            className="text-xs text-blue-500 font-medium hover:underline"
          >
            View comments
          </button>
        </div>
      )}
      {/* Share Buttons Section */}
      <div className="flex justify-around border">
        {/* Like Button */}
        <button
          onClick={likeHandler}
          className="flex items-center sm:px-3  justify-center gap-2 w-full px-1 py-2 bg-gray-50 hover:bg-gray-200 transition-all"
        >
          <span
            className={`${
              isLiked && "likeAnimate"
            } transition-all duration-300 text-base text-gray-700`}
          >
            {isLiked ? shareIcons[0].liked : Shares[0].icon}
          </span>
          <span className="text-xs sm:text-sm font-medium text-gray-700">
            {shareIcons[0].label}
          </span>
        </button>

        {/* Comments Button */}
        <button
          onClick={handleCommentBox}
          className="flex items-center sm:px-3  justify-center gap-2 w-full px-1 py-2 bg-gray-50 hover:bg-gray-200 transition-all"
        >
          <span className="transition-all duration-300 text-base text-gray-700">
            {shareIcons[1].icon}
          </span>
          <span className="text-xs sm:text-sm font-medium text-gray-700">
            {shareIcons[1].label}
          </span>
        </button>

        {/* Tag Button */}
        <button className="flex items-center  sm:px-3 justify-center gap-2 w-full px-1 py-2 bg-gray-50 hover:bg-gray-200 transition-all">
          <span className="transition-all duration-300 text-base text-gray-700">
            {shareIcons[2].icon}
          </span>
          <span className="text-xs sm:text-sm font-medium text-gray-700">
            {shareIcons[2].label}
          </span>
        </button>

        {/* Share Button */}
        <button className="flex items-center sm:px-1  justify-center gap-2 w-full px-3 py-2 bg-gray-50 hover:bg-gray-200 transition-all">
          <span className="transition-all duration-300 text-base text-gray-700">
            {shareIcons[3].icon}
          </span>
          <span className="text-xs sm:text-sm font-medium text-gray-700">
            {shareIcons[3].label}
          </span>
        </button>
      </div>
      {postId && postId === post._id && (
        <CommentBox
          postId={postId}
          post={post}
          userId={userId}
          postUser={postUser}
        />
      )}
    </div>
  );

  
}

export default React.memo(Post);

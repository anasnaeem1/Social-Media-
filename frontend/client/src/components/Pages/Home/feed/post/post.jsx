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
import PostSkeleton from "../../../../Skeleton/postSkeleton";

function Post({ post, userId, searchInput }) {
  const { dispatch, commentBox, user } = useContext(UserContext);
  const { Friends, Shares } = mainItems;
  const [likes, setLikes] = useState(post?.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [postUser, setPostUser] = useState({});
  const navigate = useNavigate();
  const [userLoading, setUserLoading] = useState(true);
  const [isImg, setIsImg] = useState(false);
  const params = useParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMoreOptionVisible, setIsMoreOptionVisible] = useState(false);
  const [isPostHide, setIsPostHide] = useState(false);
  const [postIsVisibleAgain, setPostIsVisibleAgain] = useState(false);
  const { postId } = useParams();
  const dropdownRef = useRef(null);
  const optionButtonRef = useRef(null);

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        optionButtonRef.current &&
        !optionButtonRef.current.contains(event.target)
      ) {
        setIsMoreOptionVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setUserLoading(true);
        const res = await axios.get(`/api/users?userId=${post.userId}`);
        setPostUser(res.data);
        setUserLoading(false);
      } catch (error) {
        console.log("Error fetching user", error);
      }
    };
    fetchUser();
    if (post?.likes?.includes(user._id)) {
      setIsLiked(true);
    }
  }, [post.userId, post.likes, user._id]);

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
    if (post?.img) {
      setIsImg(true);
    }
  }, [post.userId, post]);

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

  const handleMoreOptions = (e) => {
    e.preventDefault();
    setIsMoreOptionVisible(!isMoreOptionVisible);
  };

  const handleRemovePostAlert = (e) => {
    e.preventDefault();
    setIsPostHide(true);
  };

  const handleRemovePostUndo = (e) => {
    e.preventDefault();
    setPostIsVisibleAgain(true);
    setIsPostHide(false);
  };

  const handleRemovePost = (e) => {
    e.preventDefault();
    dispatch({
      type: "POSTID",
      payload: post._id,
    });
  };

  return (
    <>
      <>
        {isPostHide ? (
          <div className="bg-white mx-4 relative shadow-md border border-gray-200 rounded-lg flex flex-col max-w-[540px] w-full p-6">
            {/* Confirmation Message */}
            <>
              <div className="text-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  Are you sure you want to remove this post?
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  This action cannot be undone. Please confirm your choice.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  className="px-6 py-2 bg-red-500 text-white font-medium rounded-lg shadow hover:bg-red-600 transition duration-200"
                  onClick={handleRemovePost}
                >
                  Remove
                </button>
                <button
                  className="px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg shadow hover:bg-gray-300 transition duration-200"
                  onClick={handleRemovePostUndo}
                >
                  Undo
                </button>
              </div>
            </>
          </div>
        ) : (
          <div
            className={` bg-white mx-4 relative shadow-md border border-gray-200 rounded-lg flex flex-col max-w-[540px] w-full md:w-[540px] ${
              postIsVisibleAgain &&
              "animate__animated  animate__fadeIn bg-animate"
            }`}
          >
            {userLoading ? (
              isImg ? (
                <PostSkeleton isImg={isImg} />
              ) : (
                <PostSkeleton />
              )
            ) : (
              <div>
                {/* Post Header */}
                {isMoreOptionVisible && (
                  <div
                    ref={dropdownRef}
                    className="absolute border rounded-lg z-10 top-[60px] right-[50px] w-[350px] bg-white shadow-md"
                  >
                    <div className="border-b pb-2">
                      <div className="cursor-pointer font-medium text-gray-600 text-md m-1 hover:bg-gray-100 p-2 ">
                        <span>
                          <i className=" text-xl mr-1  ri-pushpin-fill"></i>
                        </span>{" "}
                        Pin post
                      </div>
                      <div className="cursor-pointer flex items-center font-medium text-gray-600 m-1  hover:bg-gray-100 p-2 ">
                        {" "}
                        <span className="mr-2 text-xl">
                          <i className="ri-save-fill"></i>
                        </span>{" "}
                        <div className="flex flex-col">
                          <span className="text-md">Save a post</span>
                          <span className="text-xsm text-gray-500">
                            add this to your save list
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="cursor-pointer font-medium text-gray-600 text-md m-1 hover:bg-gray-100 p-2 ">
                      <span>
                        <i className=" text-xl mr-1  ri-edit-fill"></i>
                      </span>{" "}
                      Edit post
                    </div>
                    <div className="cursor-pointer font-medium text-gray-600 text-md m-1 hover:bg-gray-100 p-2 ">
                      <span>
                        <i className=" text-xl mr-1  ri-edit-fill"></i>
                      </span>{" "}
                      Edit post
                    </div>
                    <div className="cursor-pointer font-medium text-gray-600 text-md m-1 hover:bg-gray-100 p-2 ">
                      <span>
                        <i className=" text-xl mr-1  ri-edit-fill"></i>
                      </span>{" "}
                      Edit post
                    </div>
                  </div>
                )}
                <div className="flex px-4 py-3 justify-between items-center">
                  <div className="flex items-center gap-3">
                    {/* User Photo */}
                    {userLoading ? (
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
                      {userLoading ? (
                        <div className="w-[120px] h-[12px] mb-1 bg-gray-300 rounded-md animate-pulse"></div>
                      ) : (
                        <h1 className="cursor-pointer text-sm font-semibold text-gray-800">
                          {postUser.username}
                        </h1>
                      )}
                      {userLoading ? (
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
                    <button
                      ref={optionButtonRef}
                      onClick={handleMoreOptions}
                      className="flex justify-center items-center hover:bg-gray-100 w-8 h-8 rounded-full text-xl"
                    >
                      <i className="ri-more-line"></i>
                    </button>
                    <button
                      onClick={handleRemovePostAlert}
                      className="flex justify-center items- center hover:bg-gray-100 w-8 h-8 rounded-full text-xl"
                    >
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
                    <div className="mt-3 w-full rounded-md overflow-hidden">
                      <img
                        src={`/images/${post.img}`}
                        alt="Post Image"
                        className="w-full object-contain h-auto"
                      />
                    </div>
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
            )}
          </div>
        )}
      </>
    </>
  );
}

export default React.memo(Post);

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
import { toast } from "react-toastify";
import CommentBox from "./comments/commentBox";
import PostSkeleton from "../../../../Skeleton/postSkeleton";
import { getUser } from "../../../../../apiCalls";
import PostButton from "./postButton";

function Post({ post, userId, searchInput, isBackNavigation }) {
  const {
    dispatch,
    commentBox,
    user,
    postId: removedPostId,
  } = useContext(UserContext);
  const { Friends, Shares } = mainItems;
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [postUser, setPostUser] = useState({});
  const navigate = useNavigate();
  const [userLoading, setUserLoading] = useState(true);
  const [isImg, setIsImg] = useState(false);
  const params = useParams();
  const [isMoreOptionVisible, setIsMoreOptionVisible] = useState(false);
  const [postDesc, setPostDesc] = useState(false);
  const [isPostHide, setIsPostHide] = useState(false);
  const [postIsVisibleAgain, setPostIsVisibleAgain] = useState(false);
  const [isPostDescHide, setIsPostDescHide] = useState(true);
  // const { postId } = useParams();
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setUserLoading(true);
        const user = await getUser(post?.userId, 0);
        setPostUser(user);
        setUserLoading(false);
      } catch (error) {
        console.log("Error fetching user", error);
      }
    };
    fetchUser();
  }, [post.userId, post.likes, user._id]);

  useEffect(() => {
    if (post?.img) {
      setIsImg(true);
    }
  }, [post.userId, post]);

  const highlightText = (text, searchTerm) => {
    if (typeof text !== "string") text = String(text); // Ensure input is a string
    if (!searchTerm) return text; // If no search term, return original text

    // Escape special regex characters in searchTerm
    const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedSearchTerm})`, "gi");

    const parts = text.split(regex); // Split text at search term

    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
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
    setIsMoreOptionVisible((prev) => !prev);

    setTimeout(() => {
      if (dropdownRef.current) {
        dropdownRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, 100); // Small delay to ensure visibility
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

  const handleSeeMore = (e) => {
    e.preventDefault();
    setIsPostDescHide(!isPostDescHide);
  };

  const handleDeletePost = (e) => {
    e.preventDefault();
    setIsMoreOptionVisible(false);
    dispatch({
      type: "TOGGLEFLOATINGBOX",
      payload: { disable: false, purpose: "deletePost", details: post },
    });
  };

  const handlePinPost = async (e) => {
    e.preventDefault();

    if (!user || !post) {
      toast.error("User or post data is missing.");
      return;
    }

    const userId = user._id;

    try {
      const response = await axios.put(`/api/posts/${post._id}`, {
        userId: userId,
        pinned: !post.pinned,
      });

      if (response.status === 200) {
        setIsMoreOptionVisible(false);
        post.pinned = !post.pinned;
      }
    } catch (error) {
      console.error("Failed to pin the post:", error);
      toast.error("Failed to pin the post. Please try again.");
    }
  };

  return (
    <>
      <>
        {isPostHide ? (
          <div className="bg-white mx-4 relative shadow-md border border-gray-200 rounded-lg flex flex-col max-w-[540px] w-full md:w-[540px] p-4 space-y-3">
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
          // me : postIsVisibleAgain ? (
        ) : (
          <>
            <div
              className={`${
                userId ? "postSkeletonWidthForProfile" : ""
              } bg-white mx-4 relative shadow-md border border-gray-200 rounded-lg flex flex-col max-w-[540px] w-full md:w-[540px] ${
                postIsVisibleAgain &&
                "animate__animated  animate__fadeIn bg-animate"
              }`}
            >
              {!isBackNavigation && userLoading ? (
                isImg ? (
                  <PostSkeleton userId={userId} isImg={isImg} />
                ) : (
                  <PostSkeleton userId={userId} />
                )
              ) : (
                <div>
                  {/* POST OPTIONS */}
                  {isMoreOptionVisible && (
                    <div
                      ref={dropdownRef}
                      className="absolute border rounded-lg z-[9] sm:top-[60px] sm:right-[50px] w-full sm:max-w-[350px] bg-white shadow-lg"
                    >
                    <div
                        onClick={()=> setIsMoreOptionVisible(false)}
                        className="absolute md:hidden md:top-0 top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl cursor-pointer transition"
                      >
                        <i className="ri-close-line"></i>
                      </div> 
                         {/* Close Icon */}
                      <div
                        onClick={()=> setIsMoreOptionVisible(false)}
                        className="absolute md:hidden md:top-0 top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl cursor-pointer transition"
                      >
                        <i className="ri-close-line"></i>
                      </div>

                      {/* Header Section */}``
                      <div className="md:p-2 p-4 border-b">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Post Options
                        </h3>
                        <p className="text-sm text-gray-500">
                          Manage your post settings
                        </p>
                      </div>

                      {/* Options Section */}
                      <div className="p-2">
                        {/* Pin Post */}
                        {post.userId === user._id && (

                          <div
                            onClick={handlePinPost}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200"
                          >
                            <i className="ri-pushpin-fill text-2xl text-blue-500"></i>
                            <div className="flex flex-col">
                              <span className="text-md font-medium text-gray-700">
                                {post.pinned ? "Unpin" : "Pin"} Post
                              </span>
                              <span className="text-sm text-gray-500">
                                Keep this post at the top
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Save Post */}
                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200">
                          <i className="ri-save-fill text-2xl text-green-500"></i>
                          <div className="flex flex-col">
                            <span className="text-md font-medium text-gray-700">
                              Save Post
                            </span>
                            <span className="text-sm text-gray-500">
                              Add this to your saved items
                            </span>
                          </div>
                        </div>

                        {/* Edit Post */}
                        {post.userId === user._id && (
                          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200">
                            <i className="ri-edit-fill text-2xl text-purple-500"></i>
                            <div className="flex flex-col">
                              <span className="text-md font-medium text-gray-700">
                                Edit Post
                              </span>
                              <span className="text-sm text-gray-500">
                                Modify this post
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Delete Post */}
                        {post.userId === user._id && (
                          <div
                            onClick={handleDeletePost}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200"
                          >
                            <i className="ri-delete-bin-fill text-2xl text-red-500"></i>
                            <div className="flex flex-col">
                              <span className="text-md font-medium text-gray-700">
                                Delete Post
                              </span>
                              <span className="text-sm text-gray-500">
                                Remove this post permanently
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer Section */}
                      <div className="p-4 border-t">
                        <p className="text-sm text-gray-500 text-center">
                          Need help?{" "}
                          <span className="text-blue-500 cursor-pointer">
                            Contact support
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex px-4 py-3 justify-between items-center">
                    <div className="flex items-center gap-3">
                      {/* User Photo */}
                      {userLoading ? (
                        <div className="w-[40px] h-[40px] bg-gray-300 rounded-full animate-pulse"></div> // Skeleton for user photo
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
                          <div className="w-[120px] h-[16px] bg-gray-300 rounded-md animate-pulse mb-1"></div> // Skeleton for the username
                        ) : (
                          <div
                            onClick={() => navigate(`/profile/${postUser._id}`)}
                            className="flex items-center gap-2"
                          >
                            <h1 className="cursor-pointer text-sm font-semibold text-gray-800">
                              {postUser.fullname}
                            </h1>
                            {/* Pinned Post Icon */}
                            {userId && post?.pinned && (
                              <i className="text-base text-gray-500 ri-pushpin-fill"></i>
                            )}
                          </div>
                        )}

                        {userLoading ? (
                          <div className="w-[80px] h-[10px] bg-gray-300 rounded-md animate-pulse"></div> // Skeleton for date
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
                        className="flex justify-center items-center hover:bg-gray-100 w-8 h-8 rounded-full text-xl"
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
                      {(() => {
                        const maxLength = post.img ? 89 : 150;
                        const isLongText = post.desc.length > maxLength;

                        // Function to replace \n with <br/>
                        const formatText = (text) => {
                          if (typeof text !== "string") {
                            return text;
                          }

                          return text.split("\n").map((line, index) => (
                            <React.Fragment key={index}>
                              {line}
                              <br />
                            </React.Fragment>
                          ));
                        };

                        if (isLongText && isPostDescHide) {
                          const trimmedText = post.desc.slice(0, maxLength);
                          const lastSpaceIndex = trimmedText.lastIndexOf(" ");
                          const finalText =
                            lastSpaceIndex > 0
                              ? trimmedText.slice(0, lastSpaceIndex) + "..."
                              : trimmedText + "...";

                          return (
                            <>
                              <span>{formatText(finalText)}</span>
                              <span
                                className="text-blue-500 cursor-pointer"
                                onClick={handleSeeMore}
                              >
                                See more...
                              </span>
                            </>
                          );
                        }

                        return (
                          <>
                            <span>
                              {formatText(
                                highlightText(post.desc, searchInput)
                              )}
                            </span>

                            {isLongText && (
                              <span
                                className="text-blue-500 cursor-pointer"
                                onClick={handleSeeMore}
                              >
                                Hide post...
                              </span>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}

                  {/* Image Section */}
                  {post.img && (
                    <Link to={`/photo/post/${post._id}`}>
                      <div className="mt-3 w-full rounded-md overflow-hidden">
                        <img
                          src={post.img}
                          alt="Post Image"
                          className="w-full object-cover"
                        />
                      </div>
                    </Link>
                  )}
                  <PostButton postUser={postUser} post={post} />
                  {/* {
                    <CommentBox
                      // postId={postId}
                      post={post}
                      userId={userId}
                      postUser={postUser}
                    />
                  } */}
                </div>
              )}
            </div>
          </>
        )}
      </>
    </>
  );
}

export default React.memo(Post);

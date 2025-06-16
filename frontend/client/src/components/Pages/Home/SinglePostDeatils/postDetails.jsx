import React, { useContext, useEffect, useState } from "react";
import UserPhoto from "../../../userPhoto";
import { UserContext } from "../../../context/UserContext";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import PostButton from "../feed/post/postButton";
import axios from "axios";
import { getPostWithPostUser } from "../../../../apiCalls";
import { format } from "timeago.js";
import CommentBox from "../feed/post/comments/commentBox";
import CommentSumbitForm from "../feed/post/comments/commentSubmitForm";

function postDetails() {
  const location = useLocation();
  const { postId } = useParams();
  const navigate = useNavigate();
  const [isPostDescHide, setIsPostDescHide] = useState(true);
  const [endingAnimation, setEndingAnimation] = useState(false);
  const [post, setPost] = useState(null);
  const [postUser, setPostUser] = useState(null);
  const isPostPage = location.pathname.startsWith("/post");
  const { dispatch, postDetails, user } = useContext(UserContext);

  const handleBackToHome = (e) => {
    e.preventDefault();

    setEndingAnimation(true);

    setTimeout(() => {
      navigate(-1);
      setPost([[]]);
      setPostUser([[]]);
      dispatch({ type: "UPDATEPOSTDETAILS", payload: {} });
      dispatch({ type: "UNRELOAD", payload: false });
    }, 300); // 3 seconds to match CSS animation
  };

  useEffect(() => {
    if (isPostPage) {
      setEndingAnimation(false); // Ensure it starts visible
    }
  }, [isPostPage]);

  const searchInput = "";

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

  const fetchPostAndPostUser = async () => {
    if (postId) {
      const postAndPostUser = await getPostWithPostUser(postId);
      setPost(postAndPostUser.post);
      setPostUser(postAndPostUser.postUser);
    }
  };

  useEffect(() => {
    if (postDetails) {
      const { post, postUser } = postDetails;
      if (post && postUser) {
        setPost(post);
        setPostUser(postUser);
      } else if (postId) {
        // setPost({});
        // setPostUser({});
        fetchPostAndPostUser();
      }
    }
  }, [postDetails]);

  const handleSeeMore = (e) => {
    e.preventDefault();
    setIsPostDescHide(!isPostDescHide);
  };

  return (
    <>
      {
        <>
          <div
            className={`${!isPostPage ? "hidden" : "block"}  ${
              endingAnimation ? "animate-fadeOut" : ""
            } fixed inset-0 po bg-blue-50 bg-opacity-50 z-40`}
          ></div>

          {/* Centered Post Component */}
          <div
            className={`
     ${isPostPage ? "block" : "hidden"} 
     ${endingAnimation ? "hidden" : ""}
     fixed transition-all max-w-[800px] w-full md:h-[600px] h-full duration-300 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg z-50 shadow-2xl border border-gray-300 overflow-y-auto custom-scrollbar
  `}
          >
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-white border-b p-3 flex justify-between items-center">
              <div className="text-center w-full">
                {post ? (
                  <h1 className="text-lg font-semibold text-blue-800">
                    {postUser?.fullname}'s Post
                  </h1>
                ) : (
                  <div className="h-6 w-[120px] bg-gray-200 rounded mx-auto"></div>
                )}
              </div>
              <button
                onClick={handleBackToHome}
                className="w-10 h-10 flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full transition"
              >
                <i
                  className={`${
                    window.innerWidth >= 768
                      ? "ri-close-line"
                      : "ri-arrow-left-line"
                  } text-2xl`}
                ></i>
              </button>
            </div>

            {/* User Info */}
            <div className="p-3 border-b flex items-center">
              {!post ? (
                <>
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="ml-2 flex-1 space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </>
              ) : (
                <>
                  {postUser && (
                    <UserPhoto userId={postUser._id} user={postUser} />
                  )}
                  <div className="ml-2">
                    <h2 className="font-semibold text-gray-800">
                      {postUser.fullname}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {format(post.createdAt)}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Description */}
            {post ? (
              post.desc && (
                <div
                  className={`px-3 py-2 text-gray-800 ${
                    post.img ? "text-sm" : "text-base"
                  }`}
                >
                  {(() => {
                    const maxLength = post.img ? 89 : 150;
                    const isLongText = post.desc.length > maxLength;

                    if (isLongText && isPostDescHide) {
                      const trimmed = post.desc.slice(0, maxLength);
                      const cutIndex = trimmed.lastIndexOf(" ");
                      const preview =
                        cutIndex > 0
                          ? trimmed.slice(0, cutIndex) + "..."
                          : trimmed + "...";
                      return (
                        <>
                          <span>{highlightText(preview, searchInput)}</span>{" "}
                          <button
                            onClick={handleSeeMore}
                            className="text-blue-500 hover:text-blue-600 text-sm"
                          >
                            See more...
                          </button>
                        </>
                      );
                    }
                    return <span>{highlightText(post.desc, searchInput)}</span>;
                  })()}
                </div>
              )
            ) : (
              <div className="px-3 py-2 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            )}

            {/* Image */}
            {post ? (
              post.img && (
                <div className="px-3 py-2">
                  <div className="overflow-hidden rounded-md hover:bg-blue-50 transition">
                    <img
                      src={post.img}
                      alt="Post"
                      className="w-full max-h-[400px] object-contain"
                    />
                  </div>
                </div>
              )
            ) : (
              <div className="px-3 py-2">
                <div className="h-[300px] bg-gray-200 rounded-md"></div>
              </div>
            )}

            {/* Post Buttons */}
            <div className="p-3 border-t">
              <PostButton post={post} postUser={postUser} />
            </div>

            {/* Comments */}
            {post && (
              <>
                <CommentBox
                  post={post}
                  postDetails={true}
                  userId={user._id}
                  postUser={postUser}
                />
                <CommentSumbitForm post={post} isPostPage={isPostPage} />
              </>
            )}
          </div>
        </>
      }
    </>
  );
}
export default postDetails;

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
      dispatch({
        type: "UPDATEPOSTDETAILS",
        payload: {},
      });
      dispatch({ type: "UNRELOAD", payload: false });
    }, 300); // 0.3 seconds delay
  };

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
      } else {
        fetchPostAndPostUser();
        setPost({});
        setPostUser({});
      }
    }
  }, [postDetails]);

  const handleSeeMore = (e) => {
    e.preventDefault();
    setIsPostDescHide(!isPostDescHide);
  };

  useEffect(() => {
    const animationDuration = 2000;
    const animationTimeout = setTimeout(() => {
      setEndingAnimation(true);
    }, animationDuration);

    return () => clearTimeout(animationTimeout); // Cleanup
  }, []);

  return (
    <>
      {
        <>
          <div
            className={`${
              isPostPage ? "block" : "hidden"
            } fixed inset-0 po bg-blue-50 bg-opacity-50 z-40`}
          ></div>

          {/* Centered Post Component */}
          <div
            className={`${
              isPostPage ? "opacity-100 h-[600px]" : "opacity-0 max-h-0 h-0"
            } fixed transition-all max-w-[800px] w-full duration-300 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg z-50 shadow-2xl border border-gray-300 overflow-y-auto custom-scrollbar`}
          >
            {/* Sticky Header Section */}
            <div className="sticky top-0 py-3 z-[999] bg-white">
              <div className="flex justify-between items-center border-b p-3">
                {!post ? (
                  <div className="w-full text-center">
                    <div className="h-6 bg-gray-200 rounded w-[120px] mx-auto"></div>
                  </div>
                ) : (
                  <div className="w-full text-center">
                    <h1 className="text-lg font-semibold text-gray-800">
                      {postUser?.fullname}'s Post
                    </h1>
                  </div>
                )}
                <button
                  onClick={handleBackToHome}
                  className="w-8 h-8 flex justify-center items-center bg-gray-50 hover:bg-gray-200 rounded-full transition-all duration-300"
                  aria-label="Close"
                >
                  <i className="ri-close-line text-xl text-gray-600"></i>
                </button>
              </div>
            </div>
            {/* User Details Section */}
            {!post ? (
              <div className="flex items-center p-3 border-b">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="ml-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ) : (
              <div className="flex items-center p-3 border-b">
                {postUser && (
                  <UserPhoto userId={postUser?._id} user={postUser} />
                )}
                <div className="ml-2">
                  <h1 className="font-semibold text-gray-800 text-md">
                    {postUser?.fullname}
                  </h1>
                  <p className="text-xs text-gray-500">
                    {format(post?.createdAt)}
                  </p>
                </div>
              </div>
            )}
            {/* Post Description Section */}
            {!post ? (
              <div className="px-3 py-2">
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ) : (
              post?.desc && (
                <div
                  className={`px-3 py-2 ${
                    post.img ? "text-sm" : "text-md"
                  } text-gray-800`}
                >
                  {(() => {
                    const maxLength = post.img ? 89 : 150; // Adjust limit based on image presence
                    const isLongText = post.desc.length > maxLength;

                    if (isLongText && isPostDescHide) {
                      const trimmedText = post.desc.slice(0, maxLength);
                      const lastSpaceIndex = trimmedText.lastIndexOf(" ");
                      const finalText =
                        lastSpaceIndex > 0
                          ? trimmedText.slice(0, lastSpaceIndex) + "..."
                          : trimmedText + "...";

                      return (
                        <>
                          <span>{highlightText(finalText, searchInput)}</span>{" "}
                          <button
                            onClick={handleSeeMore}
                            className="text-blue-500 hover:text-blue-600 cursor-pointer focus:outline-none text-sm"
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
            )}
            {/* Post Image Section */}
            {!post ? (
              <div className="px-3 py-2">
                <div className="h-[300px] bg-gray-200 rounded-md"></div>
              </div>
            ) : (
              post?.img && (
                <div className="px-3 py-2">
                  <div className="rounded-md overflow-hidden hover:bg-gray-100 transition-all duration-300">
                    <img
                      src={post.img}
                      alt="Post Image"
                      className="w-full object-contain max-h-[400px]"
                    />
                  </div>
                </div>
              )
            )}
            {/* Post Buttons Section */}
            <div className="p-3 border-t">
              <PostButton post={post} postUser={postUser} />
            </div>

            {/* Comment Box Section */}
            {post && (
              <CommentBox
                post={post}
                postDetails={true}
                userId={user._id}
                postUser={postUser}
              />
            )}
            <CommentSumbitForm post={post} isPostPage={isPostPage} />
          </div>
        </>
      }
    </>
  );
}
export default postDetails;

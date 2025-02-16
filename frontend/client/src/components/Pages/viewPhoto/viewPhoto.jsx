import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserPhoto from "../../userPhoto";
import { format } from "timeago.js";
import { UserContext } from "../../context/UserContext";
import CommentSection from "./commentSection/commentSection";
import { getUser } from "../../../apiCalls";
import CommentBox from "../Home/feed/post/comments/commentBox";

function ViewPhoto() {
  const { postId } = useParams();
  const { dispatch, user, reload } = useContext(UserContext);
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [postUser, setPostUser] = useState(null);
  const [likes, setLikes] = useState(null);
  const [postLoading, setPostLoading] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [postUserLoading, setPostUserLoading] = useState(false);
  const [isPostDescHide, setIsPostDescHide] = useState(true);
  const [commentPicture, setCommentPicture] = useState(null);
  const [commentPicPreview, setCommentPicPreview] = useState(null);
  const [newComment, setNewComment] = useState(false);

  const commentText = useRef();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (postId) {
          setPostLoading(true);
          const res = await axios.get(`/api/posts/getPost/${postId}`);
          if (res.data) {
            setPost(res.data);
            // console.log(res.data);
            setLikes(res.data?.likes?.length);
            setPostLoading(false);
          }
        }
      } catch (error) {
        console.log("Error fetching user", error);
      }
    };
    fetchPost();
  }, [postId]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (post?.userId) {
          setPostUserLoading(true);
          const user = await getUser(post?.userId, 0);
          setPostUser(user);
          setPostUserLoading(false);
        }
      } catch (error) {
        console.log("Error fetching user", error);
      }
    };
    fetchUser();
    if (post?.likes?.includes(user._id)) {
      setIsLiked(true);
    }
  }, [post?.userId, post?.likes, post]);

  const likeHandler = async () => {
    if (isLiking) return;

    setIsLiking(true);
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
    setIsLiking(false);
  };

  const handleSeeMore = (e) => {
    e.preventDefault();
    setIsPostDescHide(!isPostDescHide);
  };

  // const handleCommentFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setCommentPicture(file);
  //     setCommentPicPreview(URL.createObjectURL(file));
  //     commentText.current?.focus();
  //   }
  // };

  const handleBackToPost = () => {
    navigate(-1);
    dispatch({ type: "UNRELOAD", payload: false });
  };

  // const handleCommentSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     let uniqueFileName = null;

  //     if (commentPicture) {
  //       uniqueFileName = await uploadPhoto(commentPicture);
  //       console.log("Received unique filename:", uniqueFileName);
  //     }

  //     const newComment = {
  //       userId: user?._id,
  //       postId: postId,
  //       text: commentText.current.value,
  //       img: uniqueFileName || undefined,
  //     };

  //     const commentResponse = await axios.post(`/api/comments`, newComment);
  //     commentText.current.value = "";

  //     if (commentResponse.data) {
  //       setNewComment(true);
  //       // setComments((prevComments) => [commentResponse.data, ...prevComments]);
  //       setCommentPicture(null);

  //       // Smooth scroll to last comment
  //       const commentsContainer = document.getElementById("comments-container");
  //       const lastComment = commentsContainer?.lastElementChild;
  //       if (lastComment) {
  //         lastComment.scrollIntoView({ behavior: "smooth", block: "start" });
  //       }
  //     }
  //   } catch (error) {
  //     console.error(
  //       "Failed to post comment:",
  //       error.response?.data || error.message || error
  //     );
  //   }
  // };

  return (
    <>
      <div
        style={{ height: "calc(100vh - 65px)" }}
        className="relative overflow-hidden w-full flex bg-black justify-between bg-opacity-90"
      >
        {/* Fullscreen Image Section */}
        <div className="flex-1 flex overflow-hidden justify-center items-center relative bg-black">
          {postLoading && post ? (
            <div className="w-[80%] h-[80%] bg-gray-700 animate-pulse rounded-lg"></div>
          ) : post?.img ? (
            <img
              src={post.img}
              alt="Fullscreen"
              className="max-w-full max-h-full object-contain shadow-xl rounded-lg"
            />
          ) : (
            <p className="text-white text-xl">Image loading...</p>
          )}

          {/* Close Button */}
          <button
            onClick={handleBackToPost}
            className="absolute top-5 right-5 bg-gray-800 text-white rounded-full w-10 h-10 shadow-lg hover:bg-gray-700 transition-all"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        {/* Right Panel - Post Info + Comments */}
        <div
          style={{ height: "calc(100vh - 65px)" }}
          className="w-[30%] relative overflow-y-scroll bg-white flex flex-col shadow-lg"
        >
          {/* Post Uploader Info */}
          <div className="p-4 border-b bg-gray-50">
            {postLoading || postUserLoading ? (
              <div className="flex items-center gap-3 animate-pulse">
                <div className="w-14 h-14 bg-gray-300 rounded-full"></div>
                <div className="w-24">
                  <div className="w-26 h-4 bg-gray-300 rounded-md mb-1"></div>
                  <div className="w-12 h-3 bg-gray-300 rounded-md"></div>
                </div>
              </div>
            ) : (
              post?.userId &&
              postUser && (
                <div className="flex items-center gap-3">
                  <UserPhoto userId={post.userId} user={postUser} />
                  <div>
                    <p className="text-gray-800 font-semibold">
                      {postUser.fullname}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {format(post.createdAt)}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Post Description */}
          <div className="p-4 border-b cursor-pointer">
            {postLoading ? (
              <div className="flex flex-col gap-2">
                <div className="w-full h-4 bg-gray-300 rounded-md"></div>
                <div className="w-full h-4 bg-gray-300 rounded-md"></div>
              </div>
            ) : (
              post?.desc && (
                <p className="text-gray-800">
                  {post.desc.length > 89 ? (
                    isPostDescHide ? (
                      <>
                        {(() => {
                          const trimmedText = post.desc.slice(0, 89);
                          const lastSpaceIndex = trimmedText.lastIndexOf(" ");
                          return lastSpaceIndex > 0
                            ? trimmedText.slice(0, lastSpaceIndex) + "..."
                            : trimmedText + "...";
                        })()}{" "}
                        <span onClick={handleSeeMore}>See more...</span>
                      </>
                    ) : (
                      <>
                        <span onClick={handleSeeMore}>{post.desc}</span>{" "}
                        <span className="text-blue-500" onClick={handleSeeMore}>
                          Hide post...
                        </span>
                      </>
                    )
                  ) : (
                    post.desc
                  )}
                </p>
              )
            )}
          </div>

          {/* Like Button Section */}
          <div className="p-4 flex items-center gap-3 border-b">
            <button
              className={`text-2xl transition ${
                isLiked ? "text-blue-500" : "text-gray-500"
              } hover:scale-110`}
              onClick={likeHandler}
            >
              {isLiked ? (
                <i className="ri-thumb-up-fill"></i>
              ) : (
                <i className="ri-thumb-up-line"></i>
              )}
            </button>
            <span
              className={`font-semibold ${
                isLiked ? "text-blue-500" : "text-gray-700"
              }`}
            >
              {likes} Likes
            </span>
          </div>

          {/* Comments Section */}
          <div className="flex-1 h-[300px] flex flex-col">
            {/* Comments List */}
            {post && (
              <CommentBox
                ViewPhoto={true}
                // postId={postId}
                post={post}
                userId={user._id}
                postUser={postUser}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewPhoto;

{
  /* Under Development Tag */
}
{
  //   /* <div className="absolute top-10 left-10 bg-yellow-500 text-black px-6 py-3 rounded-full shadow-lg animate-pulse">
  //   <span className="font-bold text-xl">Under Development</span>
  //   <div className="sticky bottom-0 left-0  bg-white w-full p-3 border-t border-gray-300 flex flex-col gap-2">
  //     {/* Image Preview (If Selected) */}
  //     {commentPicture && (
  //       <div className="flex items-center gap-2">
  //         <img
  //           src={commentPicPreview}
  //           alt="Seleh-screencted preview"
  //           className="w-[90px] h-[90px] rounded-md object-cover border"
  //         />
  //         <button
  //           type="button"
  //           className="text-red-500 text-xs"
  //           onClick={() => {
  //             setCommentPicture(null);
  //             setCommentPicPreview(null);
  //           }}
  //         >
  //           Remove
  //         </button>
  //       </div>
  //     )}
  //     <form
  //       onSubmit={handleCommentSubmit}
  //       className="flex items-center gap-2"
  //     >
  //       {/* Text Area */}
  //       <textarea
  //         style={{ scrollbarWidth: "none" }}
  //         id="comment-input"
  //         placeholder="Write a comment..."
  //         rows={1}
  //         maxLength={300}
  //         className="w-full  border border-gray-300 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
  //         onKeyDown={(e) => {
  //           if (e.key === "Enter" && !e.shiftKey) {
  //             e.preventDefault();
  //             if (e.target.value.trim()) {
  //               handleCommentSubmit(e);
  //             }
  //           }
  //         }}
  //         onInput={(e) => {
  //           e.target.style.height = "auto";
  //           e.target.style.height = `${Math.min(
  //             e.target.scrollHeight,
  //             60
  //           )}px`;
  //         }}
  //         ref={commentText}
  //       ></textarea>
  //       {/* Image Upload */}
  //       <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 p-2 rounded-md">
  //         <i className="ri-image-add-line text-xl text-gray-600"></i>
  //         <input
  //           onChange={handleCommentFileChange}
  //           type="file"
  //           className="hidden"
  //         />
  //       </label>
  //       {/* Post Button */}
  //       <button
  //         type="submit"
  //         className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
  //       >
  //         Post
  //       </button>
  //     </form>
  //   </div>
  // </div> */
}

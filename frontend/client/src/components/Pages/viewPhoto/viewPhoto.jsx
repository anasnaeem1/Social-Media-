import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserPhoto from "../../userPhoto";
import { format } from "timeago.js";
import { UserContext } from "../../context/UserContext";
import CommentSection from "./commentSection/commentSection";
import { getUser } from "../../../apiCalls";
import CommentBox from "../Home/feed/post/comments/commentBox";
import CommentSumbitForm from "../Home/feed/post/comments/commentSubmitForm";
import Reply from "../Home/feed/post/comments/reply";

function ViewPhoto() {
  const { viewPhoto, photoId } = useParams();
  const { dispatch, user, reload } = useContext(UserContext);
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();
  const [photoDetails, setPhotoDetails] = useState(null);
  const [photoUser, setPhotoUser] = useState(null);
  const [likes, setLikes] = useState(null);
  const [photoDetailsLoading, setPhotoDetailsLoading] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [photoUserLoading, setPhotoUserLoading] = useState(false);
  const [isPostDescHide, setIsPostDescHide] = useState(true);
  const [forPost, setForPost] = useState(false);
  const [forComment, setForComment] = useState(false);
  const [replies, setReplies] = useState([]);
  const [replyPicture, setReplyPicture] = useState(null);
  const [replyPicPreview, setReplyPicPreview] = useState(null);
  const [newReply, setNewReply] = useState(false);
  // const [replyTextValue, setReplyTextValue] = useState(null);
  const replyText = useRef();

  useEffect(() => {
    setForPost(false);
    setForComment(false);

    if (viewPhoto === "post") {
      setForPost(true);
    } else if (viewPhoto === "comment") {
      setForComment(true);
    }
  }, [viewPhoto]);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        if (!forComment) {
          return;
        }
        const repliesRes = await axios.get(`/api/commentsReplies/${photoId}`);
        if (repliesRes.data) {
          setReplies(repliesRes.data);
        }
      } catch (error) {
        console.log("Error fetching user", error);
      }
    };
    fetchReplies();
  }, [forPost, forComment]);

  useEffect(() => {
    const fetchPhotoDetails = async () => {
      try {
        if (forPost || forComment) {
          setPhotoDetailsLoading(true);
          if (forPost) {
            const res = await axios.get(`/api/posts/getPost/${photoId}`);
            // console.log("postDetails is here", res.data);
            setPhotoDetails(res.data);
          } else if (forComment) {
            const res = await axios.get(
              `/api/comments/singleComment/${photoId}`
            );
            // console.log("commentDetails is here", res.data);
            setPhotoDetails(res.data);
          }
          if (photoDetails) {
            setLikes(photoDetails?.likes?.length);
          }
          setPhotoDetailsLoading(false);
        }
      } catch (error) {
        console.log("Error fetching user", error);
      }
    };
    fetchPhotoDetails();
  }, [forPost, forComment]);

  useEffect(() => {
    if (Array.isArray(photoDetails?.likes)) {
      setIsLiked(photoDetails.likes.includes(user._id));
      setLikes(photoDetails.likes.length);
    }
  }, [photoDetails?.likes, user._id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (photoDetails?.userId) {
          setPhotoUserLoading(true);
          const user = await getUser(photoDetails?.userId, 0);
          setPhotoUser(user);
          setPhotoUserLoading(false);
        }
      } catch (error) {
        console.log("Error fetching user", error);
      }
    };
    fetchUser();
    if (photoDetails?.likes?.includes(user._id)) {
      setIsLiked(true);
    }
  }, [photoDetails?.userId, photoDetails?.likes, photoDetails]);

  const likeHandler = async () => {
    if (isLiking) return;

    setIsLiking(true);
    const userId = user._id;
    try {
      if (forPost) {
        await axios.put(`/api/posts/${photoDetails._id}/like`, {
          userId: userId,
        });
      } else if (forComment) {
        await axios.put(`/api/comments/${photoDetails._id}/likeComment`, {
          userId: userId,
        });
      }
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

  const handleInputChange = (e) => {
    setReplyTextValue(e.target.value);
  };

  const handleBackToPost = () => {
    navigate(-1);
    dispatch({ type: "UNRELOAD", payload: false });
  };

  const handleReplyImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReplyPicture(file);
      const previewURL = URL.createObjectURL(file);
      setReplyPicPreview(previewURL);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    try {
      let uniqueFileName = null;

      if (replyPicture) {
        uniqueFileName = await uploadPhoto(replyPicture);
        console.log("Received unique filename:", uniqueFileName);
      }

      if (forComment && user._id && photoId && replyText.current) {
        const newReply = {
          userId: user._id,
          commentId: photoId,
          text: replyText.current.value,
          img: uniqueFileName || undefined,
        };
        console.log("New Reply Payload:", newReply);

        try {
          const commentRespose = await axios.post(
            `/api/commentsReplies`,
            newReply
          );
          replyText.current.value = "";

          if (commentRespose.data) {
            console.log("API Response:", commentRespose.data);

            // Update state with the new reply
            setNewReply(true);
            setReplies((prevReplies) => [...prevReplies, commentRespose.data]);

            // Debug: Check the updated replies state
            console.log("Updated Replies:", replies);

            // Scroll into view of the newly posted reply
            setTimeout(() => {
              const newReplyElement = document.getElementById(
                `reply-${commentRespose.data._id}`
              );
              if (newReplyElement) {
                newReplyElement.scrollIntoView({
                  behavior: "smooth",
                  block: "end",
                });
              }
            }, 100); // Small delay to ensure the DOM is updated
          }
        } catch (error) {
          console.error(
            "API Error:",
            error.response?.data || error.message || error
          );
          alert("Failed to submit reply. Please try again.");
        }
      }
    } catch (error) {
      console.error(
        "An error occurred:",
        error.response?.data || error.message || error
      );
      // alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleRemoveReplyPic = () => {
    setReplyPicPreview(null);
    setReplyPicture(null);
  };

  return (
    <>
      {
        <div
          style={{ height: "calc(100vh - 65px)" }}
          className="relative overflow-hidden w-full flex bg-black justify-between bg-opacity-90"
        >
          {/* Fullscreen Image Section */}
          <div className="flex-1 flex overflow-hidden justify-center items-center relative bg-black">
            {photoDetailsLoading ? (
              <div className="w-[80%] h-[80%] bg-gray-700 animate-pulse rounded-lg"></div>
            ) : photoDetails?.img ? (
              <img
                src={photoDetails.img}
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
              {photoDetailsLoading || photoUserLoading ? (
                <div className="flex items-center gap-3 animate-pulse">
                  <div className="w-14 h-14 bg-gray-300 rounded-full"></div>
                  <div className="w-24">
                    <div className="w-26 h-4 bg-gray-300 rounded-md mb-1"></div>
                    <div className="w-12 h-3 bg-gray-300 rounded-md"></div>
                  </div>
                </div>
              ) : (
                photoDetails?.userId &&
                photoUser && (
                  <div className="flex items-center gap-3">
                    <UserPhoto userId={photoDetails.userId} user={photoUser} />
                    <div>
                      <p className="text-gray-800 font-semibold">
                        {photoUser.fullname}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {format(photoDetails.createdAt)}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Post Description */}
            <div className="p-4 border-b cursor-pointer">
              {photoDetailsLoading ? (
                <div className="flex flex-col gap-2">
                  <div className="w-full h-4 bg-gray-300 rounded-md"></div>
                  <div className="w-full h-4 bg-gray-300 rounded-md"></div>
                </div>
              ) : (
                <>
                  {forPost && photoDetails?.desc && (
                    <p className="text-gray-800">
                      {photoDetails.desc.length > 89 && isPostDescHide ? (
                        <>
                          {(() => {
                            const trimmedText = photoDetails.desc.slice(0, 89);
                            const lastSpaceIndex = trimmedText.lastIndexOf(" ");
                            return lastSpaceIndex > 0
                              ? trimmedText.slice(0, lastSpaceIndex) + "..."
                              : trimmedText + "...";
                          })()}{" "}
                          <span
                            onClick={handleSeeMore}
                            className="text-blue-500"
                          >
                            See more...
                          </span>
                        </>
                      ) : (
                        <>
                          <span>{photoDetails.desc}</span>{" "}
                          {photoDetails.desc.length > 89 && (
                            <span
                              onClick={handleSeeMore}
                              className="text-blue-500"
                            >
                              Hide post...
                            </span>
                          )}
                        </>
                      )}
                    </p>
                  )}
                  {forComment && photoDetails?.text && (
                    <p className="text-gray-800">
                      {photoDetails.text.length > 89 && isPostDescHide ? (
                        <>
                          {(() => {
                            const trimmedText = photoDetails.text.slice(0, 89);
                            const lastSpaceIndex = trimmedText.lastIndexOf(" ");
                            return lastSpaceIndex > 0
                              ? trimmedText.slice(0, lastSpaceIndex) + "..."
                              : trimmedText + "...";
                          })()}{" "}
                          <span
                            onClick={handleSeeMore}
                            className="text-blue-500"
                          >
                            See more...
                          </span>
                        </>
                      ) : (
                        <>
                          <span>{photoDetails.text}</span>{" "}
                          {photoDetails.text.length > 89 && (
                            <span
                              onClick={handleSeeMore}
                              className="text-blue-500"
                            >
                              Hide post...
                            </span>
                          )}
                        </>
                      )}
                    </p>
                  )}
                </>
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
            <div className="flex-1 border border-green-400 relative w-full h-[300px] flex flex-col">
              {/* Comments List */}
              {forPost ? (
                photoDetails && (
                  <>
                    <CommentBox
                      ViewPhoto={true}
                      post={photoDetails}
                      userId={user._id}
                      postUser={photoUser}
                    />
                  </>
                )
              ) : (
                <div className="w-full border-gray-200 bg-gray-50 rounded-md">
                  {/* Render Replies */}
                  {replies.length > 0 ? (
                    replies.map((reply) => (
                      <div key={reply._id} id={`reply-${reply._id}`}>
                        <Reply
                          viewPhoto={viewPhoto}
                          reply={reply}
                          newReply={false}
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No replies yet.</p>
                  )}

                  {/* Input for Adding a Reply */}
                  <form
                    onSubmit={handleReplySubmit}
                    className={`${
                      replies.length > 4
                        ? "sticky bottom-0"
                        : "absolute bottom-2"
                    }  bg-white border left-0 w-full flex flex-col gap-3`}
                  >
                    {/* Image Preview (on top) */}
                    {replyPicture && (
                      <div className="flex items-center gap-2">
                        <img
                          src={replyPicPreview}
                          alt="Selected preview"
                          className="w-[90px] h-[90px] rounded-md object-cover border"
                        />
                        <button
                          type="button"
                          className="text-red-500 text-xs hover:text-red-600"
                          onClick={handleRemoveReplyPic}
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {/* Input and Buttons (at the bottom) */}
                    <div className="w-full py-2 flex flex-col sm:flex-row items-stretch gap-2">
                      {/* Input Field */}
                      <input
                        type="text"
                        onChange={handleInputChange}
                        ref={replyText}
                        placeholder="Write a reply..."
                        className="flex-1 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />

                      {/* Image Upload Icon and Reply Button */}
                      <div className="flex items-stretch gap-2">
                        {/* Image Upload Icon */}
                        <label className="cursor-pointer flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-md px-3">
                          <i className="ri-image-add-line text-lg text-gray-600"></i>
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleReplyImageChange}
                          />
                        </label>

                        {/* Reply Button */}
                        <button
                          type="submit"
                          className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
            <CommentSumbitForm post={photoDetails} viewPhoto={true} />
          </div>
        </div>
      }
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

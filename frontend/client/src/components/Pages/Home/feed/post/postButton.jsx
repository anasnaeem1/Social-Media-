import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import * as mainItems from "../../../../../constants/index";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function postButton({ post, postUser }) {
  const { Friends, Shares } = mainItems;
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    dispatch,
    commentBox,
    user,
    postId: removedPostId,
  } = useContext(UserContext);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post?.likes?.length);
  const navigate = useNavigate();

  useEffect(() => {
    if (post?.likes) {
      setLikes(post.likes.length);
    }
  }, [post?.userId, post?.likes, user?._id]);

  useEffect(() => {
    if (post?.likes?.includes(user._id)) {
      setIsLiked(true);
    }
  }, [post?.userId, post?.likes, user?._id]);

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

  const handleCommentBox = async (e) => {
    e.preventDefault();
    dispatch({
      type: "UPDATEPOSTDETAILS",
      payload: { post: post, postUser: postUser },
    });
    navigate(`/post/${post?._id}`);
  };

  console.log(post?._id)

  return (
    <>
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
          {/* <button
            onClick={handleCommentBox}
            className="text-xs text-blue-500 font-medium hover:underline"
          >
            View comments
          </button> */}
        </div>
      )}
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
        <button className="hidden sm:flex items-center sm:px-3 justify-center gap-2 w-full px-1 py-2 bg-gray-50 hover:bg-gray-200 transition-all">
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
    </>
  );
}
export default postButton;

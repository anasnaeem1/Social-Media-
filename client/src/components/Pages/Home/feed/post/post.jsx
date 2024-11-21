import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import * as mainItems from "../../../../../constants/index";
// import noAvatar from "../../../../../assets/noAvatar.jpg";
// import noCover from "../../../../../assets/noCover.jpg";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import PostSkeleton from "../../../../Skeleton/postSkeleton";
import { AuthContext } from "../../../../context/AuthContext";

// import PF from "../../../../../assets";

function post({ post }) {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  // console.log(PF)
  const { user } = useContext(AuthContext);
  const { Friends, Shares } = mainItems;
  const [likes, setLikes] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [postUser, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const likeHandler = async () => {
    const userId = user._id;
    try {
      await axios.put(`http://localhost:8800/api/posts/${post._id}/like`, {
        userId: userId,
      });
      if (isLiked) {
        setLikes((prev) => prev - 1);
      } else {
        setLikes((prev) => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/users?userId=${post.userId}`
        );

        setUser(res.data);
        setIsLoading(false);
      } catch (error) {
        console.log("Error at fetching", error);
      }
    };
    fetchUser();
    if (post.likes.includes(user._id)) {
      setIsLiked(true); // Set isLiked to true if the user has already liked the post
    }
  }, [post.userId, post.likes, user._id]);
  return (
    <>
      {isLoading &&
        Array.from({ length: 5 }).map((_, index) => (
          <PostSkeleton post={{ img: "", content: "" }} key={index} />
        ))}

      <div className="bg-white mx-2 shadow-[0px_0px_22px_-13px_rgba(0,0,0,0.84)] border border-gray-200 rounded-2xl flex flex-col gap-2 max-w-[540px] w-full">
        {/* Post Header */}
        <div className="flex px-3 py-3 justify-between items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Link to={`profile/${postUser.username}`}>
              <img
                src={`${
                  postUser.profilePic
                    ? PF + "Person/" + postUser.profilePic
                    : PF + "Person/noAvatar.jpg"
                }`}
                
                alt={`${Friends[1]} ${Friends[1]}`}
                className="w-[3rem] h-[3rem] rounded-full"
              />
            </Link>
            <div className="flex flex-col">
              <h1 className="cursor-pointer text-lg">{postUser.username}</h1>
              <span className="cursor-pointer text-sm text-gray-600">
                {format(post.createdAt)}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="cursor-pointer flex justify-center items-center hover:bg-gray-200 w-10 h-10 rounded-full text-xl">
              <i className="ri-more-line"></i>
            </div>
            <div className="cursor-pointer flex justify-center items-center hover:bg-gray-200 w-10 h-10 rounded-full text-xl">
              <i className="ri-close-line"></i>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div>
          <p className="px-2 text-md ml-2 text-gray-800">{post?.desc}</p>
        </div>

        {/* Image Section */}
        <div
          className={`${
            !post.img ? "hidden" : "flex"
          }  justify-center items-center`}
        >
          <div
            // className={`${post.img ? "hidden" : "flex"} w-full h-[400px] `}
            className={`w-full h-[365px] `}
            style={{
              backgroundImage: `url(${PF + "image1.jpg"})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
        </div>

        {/* Like and Comments Section */}
        <div className="flex justify-between px-4 items-center flex-wrap">
          <div className="flex justify-start gap-2 cursor-pointer flex-wrap">
            <div
              className={`${
                likes === 0 ? "hidden" : "flex"
              } items-center justify-center text-xl gap-[-1px]`}
            >
              <span className={`${likes <= 1 ? "hidden" : undefined}`}>👍</span>{" "}
              {/* Thumbs Up */}
              <span
                className={`${
                  likes <= 2 ? "hidden" : undefined
                }text-red-600 text-2xl`}
              >
                ❤️
              </span>{" "}
              {/* Heart */}
              <span className={`${likes <= 3 ? "hidden" : undefined}`}>
                😂
              </span>{" "}
              {/* Laughing */}
            </div>
            <div
              className={`${
                likes === 0 ? "hidden" : "flex"
              } items-center justify-center list-none gap-1`}
            >
              <span>{likes}</span> <li>people like it</li>
            </div>
          </div>
          <div className="cursor-pointer flex items-center justify-center gap-1 list-none underline text-gray-800">
            <span>2</span>
            <li>comments</li>
          </div>
        </div>

        {/* Share Buttons Section */}
        <div className="flex justify-around flex-wrap py-3">
          {Shares.map((share, id) => {
            return (
              <div
                onClick={share.id === 1 && likeHandler}
                key={id}
                className="cursor-pointer hover:bg-gray-200 rounded-xl transition-all duration-300 py-2 px-3 flex justify-center items-center gap-2"
              >
                <span
                  className={`${
                    share.id === 1 && isLiked && "likeAnimate"
                  } transition-all duration-300 text-2xl `}
                >
                  {share.id === 1 && isLiked ? share.liked : share.icon}
                </span>
                <span className="text-md">{share.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default post;

import axios from "axios";
import React, { useEffect, useState } from "react";
import * as mainItems from "../../../../../constants/index";
import noAvatar from "../../../../../assets/noAvatar.jpg";
import noCover from "../../../../../assets/noCover.jpg";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
// import PF from "../../../../../assets";

function post({ post }) {
  const { Friends, Shares } = mainItems;
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});

  const likeHandler = () => {
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked ? true : false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/users?userId=${post.userId}`
        );

        setUser(res.data);
      } catch (error) {
        console.log("Error at fetching", error);
      }
    };
    fetchUser();
  }, [post.userId]);
  return (
    <div className="bg-white mx-2 shadow-[0px_0px_22px_-13px_rgba(0,0,0,0.84)] border border-gray-200 rounded-2xl flex flex-col gap-4 max-w-[540px] w-full">
      {/* Post Header */}
      <div className="flex p-2 justify-between items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Link to={`profile/${user.username}`}>
            <img
              src={user.profilePicture || noAvatar}
              alt={`${Friends[1]} ${Friends[1]}`}
              className="w-[3rem] h-[3rem] rounded-full"
            />
          </Link>
          <div className="flex flex-col">
            <h1 className="cursor-pointer text-lg">{user.username}</h1>
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
        <p className="px-2 text-sm text-gray-800">{post?.desc}</p>
      </div>

      {/* Image Section */}
      <div className={`flex justify-center items-center`}>
        <div
          // className={`${post.img ? "hidden" : "flex"} w-full h-[400px] `}
          className={`w-full h-[400px] `}
          style={{
            backgroundImage: `url(${noCover})`,
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
              like === 0 ? "hidden" : "flex"
            } items-center justify-center text-xl gap-[-1px]`}
          >
            <span className={`${like <= 1 ? "hidden" : undefined}`}>👍</span>{" "}
            {/* Thumbs Up */}
            <span
              className={`${
                like <= 2 ? "hidden" : undefined
              }text-red-600 text-2xl`}
            >
              ❤️
            </span>{" "}
            {/* Heart */}
            <span className={`${like <= 3 ? "hidden" : undefined}`}>
              😂
            </span>{" "}
            {/* Laughing */}
          </div>
          <div
            className={`${
              like === 0 ? "hidden" : " flex"
            } items-center justify-center list-none gap-1`}
          >
            <span>{like}</span> <li>people like it</li>
          </div>
        </div>
        <div className="cursor-pointer flex items-center justify-center gap-1 list-none underline text-gray-800">
          <span>2</span>
          <li>comments</li>
        </div>
      </div>

      {/* Share Buttons Section */}
      <div className="flex justify-around flex-wrap">
        {Shares.map((share, id) => {
          return (
            <div
              onClick={share.id === 1 ? likeHandler : undefined}
              key={id}
              className="cursor-pointer hover:bg-gray-200 rounded-xl transition-all duration-300 py-2 px-3 flex justify-center items-center gap-1"
            >
              <span>{share.icon}</span>
              <span>{share.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default post;

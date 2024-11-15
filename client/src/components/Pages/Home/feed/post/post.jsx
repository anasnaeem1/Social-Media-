import Daniyal from "../../../../../assets/daniyal.jpg";
import TextImage from "../../../../../assets/intro-pic2.jpg";
import React from "react";
import { useState } from "react";
// import { Emoji } from "emoji-mart";

function post({ Friends, Shares }) {
  const [like, setLike] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  const likeHandler = () => {
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked ? true : false);
  };

  return (
    <div className="border flex bg-white  shadow-lg rounded-2xl flex-col gap-1 w-[90%] ">
      <div className="flex bg-white flex-col rounded-2xl gap-4 px-4 py-3">
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <img
              src={Daniyal}
              alt={`${Friends[1]} ${Friends[1]}`}
              className="w-[3rem] h-[3rem] rounded-full"
            />
            <div className="flex flex-col ">
              <h1 className="cursor-pointer">Daniel Shoaib</h1>
              <span className="cursor-pointer text-sm text-gray-600">
                1 hour
              </span>
            </div>
          </div>
          <div>
            <div className="flex gap-3">
              <div className="cursor-pointer flex justify-center items-center hover:bg-gray-200 w-10 h-10 rounded-full text-xl">
                <i className="ri-more-line"></i>
              </div>
              <div className="cursor-pointer flex justify-center items-center hover:bg-gray-200 w-10 h-10 rounded-full text-xl">
                <i className="ri-close-line"></i>
              </div>
            </div>
          </div>
        </div>{" "}
        <div>
          <p>hey this is my first post i hope you like it</p>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div
          className="w-[550px] h-[450px] rounded-md"
          style={{
            backgroundImage: `url(${TextImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      </div>

      {/* Like And Comments */}
      <div className="flex justify-between px-4 items-center">
        <div className="flex justify-start gap-2 cursor-pointer ">
          <div className="flex items-center justify-center text-xl gap-[-1px] ">
            <span className="">&#128077;</span> {/* Thumbs Up */}
            <span className="text-red-600 text-2xl">&#10084;</span>{" "}
            {/* Heart */}
            <span className="">&#128514;</span> {/* Laughing */}
          </div>
          <div className="flex items-center justify-center list-none gap-1">
            <span>{like}</span> <li>people like it</li>
          </div>
        </div>
        <div className="cursor-pointer flex items-center justify-center gap-1 list-none underline text-gray-800">
          <span>2</span>
          <li>comments</li>
        </div>
      </div>
      <div className="flex justify-between gap-2">
        {Shares.map((share, id) => {
          return (
            <div
              onClick={share.id === 1 ? likeHandler : undefined}
              key={id}
              className="cursor-pointer hover:bg-gray-200 rounder-xl transition-all duration-300 py-2 px-8 flex justify-center items-center gap-1"
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

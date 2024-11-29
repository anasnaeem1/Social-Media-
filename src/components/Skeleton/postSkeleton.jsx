import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function PostSkeleton({ post = {} }) {
  return (
    <div className="postSkeleton rounded-2xl border bg-white transition-all duration-300">
      <div className={`${
            !post.img ? "h-[230px]" : "h-[500px]"
          } bg-white  mx-2 rounded-2xl flex flex-col gap-4 max-w-[570px] w-[530px] `}>
        {/* Post Header */}
        <div className="flex px-3 py-3 justify-between items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Skeleton circle width={48} height={48} />
            <div className="flex flex-col">
              <Skeleton width={100} height={16} />
              <Skeleton width={80} height={14} />
            </div>
          </div>
          <div className="flex gap-3">
            <Skeleton circle width={40} height={40} />
            <Skeleton circle width={40} height={40} />
          </div>
        </div>

        {/* Post Content */}
        <div className="px-2">
          <Skeleton count={1} height={16} />
        </div>

        {/* Image Section */}
        <div
          className={`${
            !post.img ? "hidden" : "flex"
          } w-full h-[365px]  justify-center items-center`}
        >
          <Skeleton width="100%" height="100%" />
        </div>

        {/* Like and Comments Section */}
        <div className="flex justify-between px-4 items-center flex-wrap">
          <div className="flex justify-start gap-2 flex-wrap">
            <Skeleton width={100} height={20} />
          </div>
          <div className="flex items-center justify-center gap-1">
            <Skeleton width={70} height={20} />
          </div>
        </div>

        {/* Share Buttons Section */}
        <div className="flex justify-around flex-wrap pt-2 pb-2">
          <Skeleton width={120} height={25} />
          <Skeleton width={120} height={25} />
          <Skeleton width={120} height={25} />
        </div>
      </div>
    </div>
  );
}

export default PostSkeleton;

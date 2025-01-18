import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function PostSkeleton({ post = {} }) {
  return (
    <div className="bg-white mx-2 shadow-md border border-gray-200 rounded-lg flex flex-col gap-4 max-w-[540px] w-full">
      {/* Post Header */}
      <div className="flex px-4 py-3 justify-between items-center">
        <div className="flex items-center gap-3">
          {/* User Photo Skeleton */}
          <Skeleton circle width={48} height={48} />
          {/* User Info Skeleton */}
          <div className="flex flex-col">
            <Skeleton width={120} height={16} />
            <Skeleton width={100} height={14} />
          </div>
        </div>
        {/* Action Buttons Skeleton */}
        <div className="flex gap-3">
          <Skeleton circle width={40} height={40} />
          <Skeleton circle width={40} height={40} />
        </div>
      </div>

      {/* Post Content Skeleton */}
      <div className="px-4">
        <Skeleton width="80%" height={16} />
      </div>

      {/* Image Section Skeleton */}
      {post.img && (
        <div className="w-full h-[365px] bg-gray-100">
          <Skeleton width="100%" height="100%" />
        </div>
      )}

      {/* Like and Comments Section Skeleton */}
      <div className="flex justify-between px-4 py-3 items-center">
        <div className="flex items-center gap-2">
          <Skeleton width={100} height={20} />
        </div>
        <Skeleton width={70} height={20} />
      </div>

      {/* Share Buttons Section Skeleton */}
      <div className="flex justify-around px-4 py-3">
        <Skeleton width={100} height={30} />
        <Skeleton width={100} height={30} />
        <Skeleton width={100} height={30} />
      </div>
    </div>
  );
}

export default PostSkeleton;

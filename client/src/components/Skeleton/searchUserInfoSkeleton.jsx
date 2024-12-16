import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function UserInfoSkeleton() {
  return (
    <div className="bg-white w-full max-w-[533px] shadow-md border border-gray-200 rounded-lg overflow-hidden">
      {/* User Info Section */}
      <div className="p-4 flex">
        {/* User Photo Skeleton */}
        <div className="overflow-hidden mr-4">
          <Skeleton circle width={56} height={56} />
        </div>
        {/* User Info Skeleton */}
        <div className="flex-1">
          <Skeleton width={120} height={20} className="mb-2" />
          <Skeleton width={200} height={16} />
        </div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
        {/* Follow Button Skeleton */}
        <Skeleton width={120} height={40} className="rounded-md" />
        {/* View Profile Button Skeleton */}
        <Skeleton width={120} height={40} className="rounded-md" />
      </div>
    </div>
  );
}

export default UserInfoSkeleton;

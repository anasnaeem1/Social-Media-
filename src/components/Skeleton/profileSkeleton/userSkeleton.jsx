import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function UserSkeleton() {
  return (
    <div>
      {/* Cover and Profile Picture */}
      <div className="relative">
        {/* Cover Skeleton */}
        <Skeleton height={300} width="100%" className="rounded-md" />

        {/* Profile Picture */}
        <div className="absolute top-[175px] left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <Skeleton circle={true} height={150} width={150} />
          <Skeleton width={120} height={25} className="mt-3" />
          <Skeleton width={180} height={20} />
        </div>
      </div>

      {/* Feed and Info Skeleton */}
      <div className="flex flex-col-reverse lg:flex-row gap-6 mt-[210px]">
        {/* Feed Skeleton */}
        <div className="flex-grow space-y-6">
          {[...Array(3)].map((_, idx) => (
            <Skeleton
              key={idx}
              height={150}
              width="100%"
              className="rounded-md"
            />
          ))}
        </div>

        {/* User Info Skeleton */}
        <div className="w-full lg:w-[300px] flex flex-col gap-6">
          <Skeleton height={150} className="rounded-md" />
          <div className="flex flex-col gap-4">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <Skeleton circle={true} height={40} width={40} />
                <Skeleton width={120} height={20} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSkeleton;

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="relative flex flex-col gap-0">
      {/* Cover Image Skeleton */}
      <div className="h-[200px] md:h-[300px] rounded-t-md mx-auto max-w-7xl w-full shadow-md">
        <Skeleton height="100%" width="100%" className="rounded-t-md" />
      </div>

      {/* Profile and Info Section Skeleton */}
      <div className="absolute top-[120px] md:top-[270px] md:left-[20px] left-1/2 transform -translate-x-1/2 md:-translate-x-0 max-w-7xl mx-auto rounded-md w-full px-4">
        <div className="flex flex-col items-center md:flex-row md:items-center gap-4">
          {/* Profile Picture Skeleton */}
          <div className="relative">
            <Skeleton
              circle
              height={140}
              width={140}
              className="shadow-lg border-2 border-white"
            />
            {/* Small Follow/Edit button Placeholder */}
            {/* <Skeleton
              circle
              height={36}
              width={36}
              className="absolute left-1/2 bottom-[-15px] transform -translate-x-1/2"
            /> */}
          </div>

          {/* User Info Skeleton */}
          <div className="text-center transform md:translate-x-2 md:translate-y-[25px] md:text-left">
            {/* Username Skeleton */}
            <Skeleton height={24} width={100} />

            {/* Bio Skeleton */}
            <div className="mt-2">
              <Skeleton height={16} width={150} />
            </div>

            {/* Action Buttons Skeleton */}
            <div className="mt-4 flex flex-wrap gap-4 justify-center md:justify-start">
              <Skeleton height={36} width={100} className="rounded-lg" />
              <Skeleton height={36} width={100} className="rounded-lg" />
              <Skeleton height={36} width={100} className="rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to prevent layout shift */}
      <div className="h-[235px] md:h-[200px]"></div>
    </div>
  );
};

export default ProfileSkeleton;

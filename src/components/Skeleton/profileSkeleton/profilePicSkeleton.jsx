import Skeleton from "react-loading-skeleton";
import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="relative">
      {/* Cover Image Skeleton */}
      <Skeleton
        height={300}
        containerClassName="h-[300px] rounded-md mx-auto max-w-7xl w-full"
        className="bg-gray-300 animate-pulse"
      />

      <div className="absolute top-[195px] left-1/2 transform -translate-x-1/2 flex flex-col justify-start items-center">
        {/* Profile Picture Skeleton */}
        <Skeleton
          circle={true}
          height={180}
          width={180}
          className="border-[3px] border-white md:h-[300px] md:w-[300px] bg-gray-300 animate-pulse"
        />

        {/* Username Skeleton */}
        <Skeleton
          height={40}
          width={190}
          className="border-[3px] border-white md:h-[300px] md:w-[300px] bg-gray-300 animate-pulse"
        />

        {/* Bio Skeleton */}
        <div className="mt-2">
          <Skeleton height={16} width="75%" />
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;

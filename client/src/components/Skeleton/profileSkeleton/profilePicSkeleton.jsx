import Skeleton from "react-loading-skeleton";
import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="relative z-2 pb-8 ">
      {/* Cover Image Skeleton */}
      <Skeleton
        height={295}
        containerClassName="h-[200px] md:h-[300px] rounded-t-md mx-auto max-w-7xl w-full shadow-md"
        className="bg-gray-300 animate-pulse"
      />

      {/* Profile and Info Section Skeleton */}
      <div className="relative px-5  max-w-7xl mx-auto rounded-md shadow-md h-[150px] ">
        <div className="flex flex-col transform -translate-y-[25px] items-center md:flex-row md:items-center gap-6">
          {/* Profile Picture Skeleton */}
          <Skeleton
            circle={true}
            height={145}
            width={145}
            containerClassName="h-[145px] w-[145px] md:h-[145px] md:w-[145px]"
            className="bg-gray-300 animate-pulse border-[3px] border-white"
          />

          {/* User Info Skeleton */}
          <div className="text-center transform translate-y-[35px] md:text-left">
            {/* Username Skeleton */}
            <Skeleton height={24} width={190} className="animate-pulse" />

            {/* Bio Skeleton */}
            <div className="mt-2">
              <Skeleton height={16} width={150} className="animate-pulse" />
            </div>

            {/* Action Buttons Skeleton */}
            <div className="mt-4 flex flex-wrap gap-4 justify-center md:justify-start">
              <Skeleton
                height={36}
                width={100}
                className="rounded-lg animate-pulse"
              />
              <Skeleton
                height={36}
                width={100}
                className="rounded-lg animate-pulse"
              />
              <Skeleton
                height={36}
                width={100}
                className="rounded-lg animate-pulse"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;

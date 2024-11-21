import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function ProfileSkeleton() {
  return (
    <div>
      {/* Navbar Skeleton */}
      <div className="h-12 bg-gray-200"></div>

      {/* Main Content */}
      <div className="flex justify-center gap-6 p-6">
        {/* Sidebar Skeleton */}
        <div className="hidden lg:flex flex-[3]">
          <div className="flex flex-col gap-6 w-full h-screen pt-5">
            {/* Options Skeleton */}
            {[...Array(5)].map((_, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 px-4"
              >
                <Skeleton circle={true} width={40} height={40} />
                <Skeleton width={120} height={20} />
              </div>
            ))}
            {/* Show More Button */}
            <div className="px-4">
              <Skeleton width={100} height={30} />
            </div>

            {/* Separator */}
            <Skeleton height={1} width="100%" className="my-6" />

            {/* Friends Skeleton */}
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="flex items-center gap-4 px-4">
                <Skeleton circle={true} width={40} height={40} />
                <Skeleton width={150} height={20} />
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-[7]">
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
      </div>
    </div>
  );
}

export default ProfileSkeleton;

import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function OptionsSkeleton() {
  return (
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
  );
}

export default OptionsSkeleton;

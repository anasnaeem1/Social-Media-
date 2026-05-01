import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="relative flex w-full flex-col gap-0 overflow-x-hidden">
      <div className="-mx-4 h-[160px] min-h-[140px] w-[calc(100%+2rem)] sm:-mx-6 sm:w-[calc(100%+3rem)] sm:rounded-t-xl md:h-[220px] md:rounded-t-2xl">
        <Skeleton height="100%" width="100%" className="rounded-none sm:rounded-t-xl md:rounded-t-2xl" />
      </div>

      <div className="relative -mt-14 px-1 sm:-mt-16 sm:px-0 md:-mt-[4.5rem] md:px-2">
        <div className="flex flex-col items-center gap-5 md:flex-row md:items-end md:gap-8">
          <div className="relative shrink-0 rounded-full ring-4 ring-white shadow-lg">
            <Skeleton circle height={128} width={128} />
          </div>

          <div className="w-full min-w-0 flex-1 pb-2 text-center md:pb-8 md:text-left">
            <Skeleton height={28} width="60%" className="mx-auto md:mx-0" />
            <div className="mt-2 space-y-2">
              <Skeleton height={14} width="85%" className="mx-auto md:mx-0" />
              <Skeleton height={14} width="55%" className="mx-auto md:mx-0" />
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
              <Skeleton height={40} width={100} className="rounded-xl" />
              <Skeleton height={40} width={100} className="rounded-xl" />
              <Skeleton height={40} width={100} className="rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;

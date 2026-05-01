import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function BirthdayCardSkeleton() {
  return (
    <div className="w-full p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between">
        {/* Friend's Photo and Info Skeleton */}
        <div className="flex items-center gap-4">
          {/* User Photo Skeleton */}
          <Skeleton circle={true} height={48} width={48} />

          {/* Full Name and Age Skeleton */}
          <div className="flex flex-col gap-2">
            <Skeleton width={120} height={20} />
            <Skeleton width={80} height={16} />
          </div>
        </div>

        {/* Wish Button Skeleton */}
        <Skeleton width={80} height={32} />
      </div>

      {/* Birthday Message Skeleton */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <Skeleton width="82%" height={17} />
      </div>
    </div>
  );
}

export default BirthdayCardSkeleton;
function PostSkeleton({ userId, isImg }) {
  return (
    <div
      className={`${
        userId ? "postSkeletonWidthForProfile" : ""
      } bg-white shadow-md w-full border border-gray-200 rounded-lg flex flex-col animate-pulse `}
    >
      {/* Post Header Skeleton */}
      <div className="flex px-4 py-3 justify-between items-center">
        <div className="flex items-center gap-3">
          {/* User Photo Skeleton */}
          <div className="w-[40px] h-[40px] bg-gray-300 rounded-full"></div>
          {/* User Info Skeleton */}
          <div>
            <div className="w-[120px] h-[12px] mb-1 bg-gray-300 rounded-md"></div>
            <div className="w-[80px] h-[10px] bg-gray-300 rounded-md"></div>
          </div>
        </div>
        {/* Action Buttons Skeleton */}
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Post Content Skeleton */}
      <div className="px-4 py-2">
        <div className="w-full h-[16px] bg-gray-300 rounded-md mb-2"></div>
        <div className="w-3/4 h-[16px] bg-gray-300 rounded-md"></div>
      </div>

      {isImg && (
        <div className="w-full h-[250px] bg-gray-300 rounded-md my-2"></div>
      )}
      {/* Like and Comments Section Skeleton */}
      <div className="flex items-center justify-between py-2 px-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
            <div className="w-6 h-6 bg-gray-300 rounded-full ml-1"></div>
          </div>
          <div className="w-[110px] sm:[150px] h-[12px] bg-gray-300 rounded-md"></div>
        </div>
        <div className="w-[50px] sm:w-[100px] h-[12px]  bg-gray-300 rounded-md"></div>
      </div>

      {/* Share Buttons Skeleton */}
      <div className="flex justify-around border-t py-2">
        <div className="flex items-center justify-center gap-2 w-full px-3">
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
          <div className="w-8 sm:w-12 h-[12px] bg-gray-300 rounded-md"></div>
        </div>
        <div className="flex items-center justify-center gap-2 w-full px-3">
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
          <div className="w-8 sm:w-12 h-[12px] bg-gray-300 rounded-md"></div>
        </div>
        <div className="flex items-center justify-center gap-2 w-full px-3">
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
          <div className="w-12 h-[12px] bg-gray-300 rounded-md"></div>
        </div>
        {/* <div className="flex items-center justify-center gap-2 w-full px-3">
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
          <div className="w-8 sm:w-12 h-[12px] bg-gray-300 rounded-md"></div>
        </div> */}
      </div>
    </div>
  );
}

export default PostSkeleton;

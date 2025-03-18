function userListSkeleton({ isFriendsRequestPage, isFriendsListPage }) {
  return (
    <div className="bg-gray-100 rounded-xl w-full px-2 py-2 relative flex items-center gap-4 animate-pulse">
      {/* User Photo Skeleton */}
      <div className="w-[60px] h-[60px] bg-gray-200 rounded-full"></div>

      {/* User Info and Buttons Skeleton */}
      <div className="flex flex-col gap-3 flex-1">
        {/* Full Name Skeleton */}
        <div className="w-3/4 h-4 bg-gray-200 rounded"></div>

        {/* Mutual Friends Skeleton (Conditional) */}
        {isFriendsListPage && (
          <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
        )}

        {/* Buttons Skeleton (Conditional) */}
        {isFriendsRequestPage && (
          <div className="flex gap-3">
            {/* Follow Back Button Skeleton */}
            <div className="w-[110px] h-8 bg-gray-200 rounded-md"></div>
            {/* Delete Button Skeleton */}
            <div className="w-[110px] h-8 bg-gray-200 rounded-md"></div>
          </div>
        )}
      </div>

      {/* More Icon Skeleton (Conditional) */}
      {isFriendsListPage && (
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
      )}
    </div>
  );
}
export default userListSkeleton;

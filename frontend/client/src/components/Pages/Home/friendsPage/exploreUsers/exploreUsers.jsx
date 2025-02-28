import { Link } from "react-router-dom";

function exploreUsers({ followReq, allUsers, users, usersLoading }) {
  return (
    <div
      className={`${
        users.length <= 4
          ? "flex items-start gap-4"
          : "grid gap-2 place-items-center md:place-items-start grid-cols-[repeat(auto-fit,minmax(200px,1fr))]"
      } `}
    >
      {usersLoading ? (
        <>
        {/* 1 */}
        <div className="flex flex-col items-center bg-white w-full max-w-[200px] text-center border rounded-lg shadow-sm hover:shadow-md transition-shadow animate-pulse">
          {/* Image Skeleton */}
          <div className="rounded-t-md w-full h-[207px] bg-gray-300"></div>

          {/* Text Skeleton */}
          <div className="mt-2 px-2 w-full">
            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
          </div>

          {/* Buttons Skeleton */}
          <div className="flex flex-col w-full gap-2 mt-3 px-2 mb-2">
            <div className="h-8 bg-gray-300 rounded-md"></div>
            <div className="h-8 bg-gray-200 rounded-md"></div>
          </div>
        </div>
        {/* 2 */}
        <div className="flex flex-col items-center bg-white w-full max-w-[200px] text-center border rounded-lg shadow-sm hover:shadow-md transition-shadow animate-pulse">
          {/* Image Skeleton */}
          <div className="rounded-t-md w-full h-[207px] bg-gray-300"></div>

          {/* Text Skeleton */}
          <div className="mt-2 px-2 w-full">
            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
          </div>

          {/* Buttons Skeleton */}
          <div className="flex flex-col w-full gap-2 mt-3 px-2 mb-2">
            <div className="h-8 bg-gray-300 rounded-md"></div>
            <div className="h-8 bg-gray-200 rounded-md"></div>
          </div>
        </div>
        {/* 3 */}
        <div className="flex flex-col items-center bg-white w-full max-w-[200px] text-center border rounded-lg shadow-sm hover:shadow-md transition-shadow animate-pulse">
          {/* Image Skeleton */}
          <div className="rounded-t-md w-full h-[207px] bg-gray-300"></div>

          {/* Text Skeleton */}
          <div className="mt-2 px-2 w-full">
            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
          </div>

          {/* Buttons Skeleton */}
          <div className="flex flex-col w-full gap-2 mt-3 px-2 mb-2">
            <div className="h-8 bg-gray-300 rounded-md"></div>
            <div className="h-8 bg-gray-200 rounded-md"></div>
          </div>
        </div>
        {/* 4 */}
        <div className="flex flex-col items-center bg-white w-full max-w-[200px] text-center border rounded-lg shadow-sm hover:shadow-md transition-shadow animate-pulse">
          {/* Image Skeleton */}
          <div className="rounded-t-md w-full h-[207px] bg-gray-300"></div>

          {/* Text Skeleton */}
          <div className="mt-2 px-2 w-full">
            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
          </div>

          {/* Buttons Skeleton */}
          <div className="flex flex-col w-full gap-2 mt-3 px-2 mb-2">
            <div className="h-8 bg-gray-300 rounded-md"></div>
            <div className="h-8 bg-gray-200 rounded-md"></div>
          </div>
        </div>
        {/* 5 */}
        <div className="flex flex-col items-center bg-white w-full max-w-[200px] text-center border rounded-lg shadow-sm hover:shadow-md transition-shadow animate-pulse">
          {/* Image Skeleton */}
          <div className="rounded-t-md w-full h-[207px] bg-gray-300"></div>

          {/* Text Skeleton */}
          <div className="mt-2 px-2 w-full">
            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
          </div>

          {/* Buttons Skeleton */}
          <div className="flex flex-col w-full gap-2 mt-3 px-2 mb-2">
            <div className="h-8 bg-gray-300 rounded-md"></div>
            <div className="h-8 bg-gray-200 rounded-md"></div>
          </div>
        </div>
        </>
      ) : users.length > 0 ? (
        users.map((users, index) => (
          <>
            <Link
              key={index}
              className="flex flex-col items-center bg-white w-full max-w-[200px] text-center border rounded-lg hover:shadow-md transition-shadow"
            >
              {!users ? (
                <div
                  className={`rounded-t-md w-[200px] h-[200px] bg-gray-300 animate-pulse`}
                ></div>
              ) : (
                <img
                  src={
                    users?.profilePic
                      ? `${users.profilePic}`
                      : `https://res.cloudinary.com/datcr1zua/image/upload/v1739709690/uploads/rindbm34tibrtqcgvpsd.png`
                  }
                  alt={`${users.fname} ${users.lname}`}
                  className="rounded-t-md w-full h-auto object-cover"
                  style={{ aspectRatio: "1 / 1" }} // Ensures the image maintains a square aspect ratio
                />
              )}
              <div className="mt-2 px-2">
                <span className="text-sm sm:text-md font-semibold text-gray-700">
                  {users.fullname}
                </span>
              </div>
              {/* Buttons section - Aligned in a column */}
              <div className="flex flex-col w-full gap-2 mt-3 px-2 mb-2">
                <button className="border w-full py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition">
                  {followReq ? "Follow Back" : allUsers ? "Follow" : ""}
                </button>
                <button className="border w-full py-2 bg-white text-black text-sm rounded-md hover:bg-gray-100 transition">
                  Delete
                </button>
              </div>
            </Link>
          </>
        ))
      ) : (
        <p className="text-xs sm:text-sm">No follow requests found</p>
      )}
    </div>
  );
}
export default exploreUsers;

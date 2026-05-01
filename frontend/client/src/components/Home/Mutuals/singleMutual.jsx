import { Link } from "react-router-dom";
import UserPhoto from "../../userPhoto";
import FollowButton from "../Buttons/followButton";

function SingleMutual({ friend }) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-3 rounded-xl border border-slate-200/90 bg-slate-50/40 p-3 transition-shadow hover:bg-white hover:shadow-md sm:flex-row sm:items-center sm:gap-4 sm:p-4">
      <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
        <UserPhoto userId={friend._id} user={friend} lg />

        <Link
          to={`/profile/${friend._id}`}
          className="min-w-0 flex-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
        >
          <p className="truncate text-base font-semibold text-slate-900 hover:underline">
            {friend.fullname}
          </p>
          <span className="text-sm font-medium text-blue-600 hover:text-blue-800">
            View profile
          </span>
        </Link>
      </div>

      <div className="flex w-full min-w-[7rem] justify-stretch sm:w-auto sm:shrink-0 sm:justify-end">
        <FollowButton otherUser={friend} text="Follow" />
      </div>
    </div>
  );
}

export default SingleMutual;

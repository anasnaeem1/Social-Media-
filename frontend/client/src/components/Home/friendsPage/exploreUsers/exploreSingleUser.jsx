import { useNavigate } from "react-router-dom";
import FollowButton from "../../Buttons/followButton";

function ExploreSingleUser({ user, followReq, allUsers: _allUsers }) {
  const navigate = useNavigate();

  const goProfile = () => navigate(`/profile/${user._id}`);

  const photoUrl =
    user?.profilePic ||
    "https://res.cloudinary.com/datcr1zua/image/upload/v1739709690/uploads/rindbm34tibrtqcgvpsd.png";

  return (
    <article className="min-w-0 w-full rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md md:flex md:max-w-[200px] md:flex-col md:overflow-hidden md:text-center">
      {/* Mobile: horizontal row */}
      <div className="flex min-w-0 items-center gap-3 p-3 md:hidden">
        <button
          type="button"
          onClick={goProfile}
          className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-full ring-2 ring-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label={`Open ${user?.fullname ?? "profile"}'s profile`}
        >
          <img
            src={photoUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        </button>
        <div className="min-w-0 flex-1 text-left">
          <button
            type="button"
            onClick={goProfile}
            className="line-clamp-2 w-full text-left text-[15px] font-semibold text-slate-800 focus:outline-none focus-visible:underline"
          >
            {user?.fullname}
          </button>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-2">
            <FollowButton
              otherUser={user}
              text={followReq ? "Accept" : "Follow"}
            />
            {followReq ? (
              <button
                type="button"
                className="min-h-[44px] flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:min-h-0 sm:flex-none sm:min-w-[6rem]"
              >
                Delete
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* md+: classic card */}
      <div className="hidden min-w-0 flex-col md:flex">
        {!user ? (
          <div className="aspect-square w-full bg-slate-200 animate-pulse" />
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              goProfile();
            }}
            className="relative block aspect-square w-full overflow-hidden rounded-none bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
          >
            <img
              src={photoUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          </button>
        )}
        <div className="flex min-w-0 flex-col gap-2 border-t border-slate-100 p-3">
          <p className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-slate-800">
            {user?.fullname}
          </p>
          <div className="flex flex-col gap-2">
            <FollowButton otherUser={user} text={followReq ? "Accept" : "Follow"} />
            {followReq ? (
              <button
                type="button"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 transition-colors hover:bg-slate-50"
              >
                Delete
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

export default ExploreSingleUser;

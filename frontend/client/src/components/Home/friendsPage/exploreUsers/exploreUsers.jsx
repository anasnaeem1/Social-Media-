import ExploreSingleUser from "./exploreSingleUser";

function ExploreUsers({ followReq, allUsers, users, usersLoading }) {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-3 sm:gap-4 md:grid-cols-[repeat(auto-fill,minmax(176px,1fr))]">
      {usersLoading ? (
        <>
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="flex min-h-[64px] w-full min-w-0 animate-pulse flex-col rounded-xl border border-slate-200 bg-white p-3 md:overflow-hidden md:rounded-xl md:border md:p-0"
            >
              <div className="hidden shrink-0 bg-slate-200 md:block md:aspect-square md:w-full" />
              <div className="flex flex-1 items-center gap-3 md:flex-col md:p-4">
                <div className="h-12 w-12 shrink-0 rounded-full bg-slate-200 md:hidden" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 rounded bg-slate-200 md:mx-auto md:w-3/4" />
                  <div className="h-10 w-full rounded-lg bg-slate-200 md:max-w-full" />
                </div>
              </div>
            </div>
          ))}
        </>
      ) : users.length > 0 ? (
        users.map((user) => (
          <ExploreSingleUser
            key={user._id}
            user={user}
            followReq={followReq}
            allUsers={allUsers}
          />
        ))
      ) : (
        <div className="col-span-full flex min-h-[140px] w-full flex-col items-center justify-center rounded-xl bg-slate-50/90 px-4 py-10 text-center">
          <i
            className="mb-3 text-4xl text-slate-400 ri-user-search-line md:text-5xl"
            aria-hidden
          />
          <p className="mb-1 text-base font-semibold text-slate-800">
            No{" "}
            {followReq
              ? "follow requests"
              : allUsers
                ? "suggestions yet"
                : "friends"}{" "}
            found
          </p>
          <p className="max-w-xs text-xs leading-relaxed text-slate-600 sm:text-sm">
            {followReq
              ? "You don't have any follow requests right now."
              : allUsers
                ? "Check back soon for people you might know."
                : "Invite friends or explore profiles to grow your circle."}
          </p>
        </div>
      )}
    </div>
  );
}

export default ExploreUsers;

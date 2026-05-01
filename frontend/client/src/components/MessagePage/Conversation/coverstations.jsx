import Convo from "./convo";

function Conversations({
  onlineUsers,
  arrivalMessage,
  setConvoLoading,
  conversations,
  userId,
  convoId,
  isLoading,
}) {
  const count = conversations?.length ?? 0;

  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-100/80">
      <header className="shrink-0 border-b border-slate-200/90 bg-white px-4 py-3.5 shadow-sm">
        <div className="flex items-baseline justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-[17px] font-bold tracking-tight text-slate-900">
              Inbox
            </h2>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              {isLoading ?
                "Loading…"
              : count === 0 ?
                "No conversations yet"
              : `${count} conversation${count === 1 ? "" : "s"}`}
            </p>
          </div>
          <div
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 sm:flex"
            aria-hidden
          >
            <i className="ri-mail-line text-lg" />
          </div>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
        {isLoading ?
          <ul className="divide-y divide-slate-200/80" aria-busy="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <li
                key={i}
                className="flex items-center gap-3 bg-white/60 px-4 py-3.5"
              >
                <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-slate-200" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 w-[40%] max-w-[10rem] animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-[85%] animate-pulse rounded bg-slate-100" />
                </div>
              </li>
            ))}
          </ul>
        : count > 0 ?
          <ul className="divide-y divide-slate-200/90 border-t border-slate-200/60 bg-white">
            {conversations.map((conversation) => (
              <li key={conversation._id} className="min-w-0">
                <Convo
                  onlineUsers={onlineUsers}
                  arrivalMessage={arrivalMessage}
                  setConvoLoading={setConvoLoading}
                  conversation={conversation}
                  isActive={String(convoId) === String(conversation._id)}
                />
              </li>
            ))}
          </ul>
        : (
          <div className="flex flex-col items-center justify-center gap-3 px-8 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200/70 text-slate-500">
              <i className="ri-chat-off-line text-2xl" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              Nothing here yet
            </p>
            <p className="max-w-[240px] text-xs leading-relaxed text-slate-500">
              Start a chat from someone’s profile and it will show up in this
              list.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Conversations;

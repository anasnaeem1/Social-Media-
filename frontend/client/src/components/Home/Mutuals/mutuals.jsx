import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import SingleMutual from "./singleMutual";

/** Suggestions list; `mainItems` kept for API compatibility with callers. */
export default function Mutuals({ mainItems: _mainItems }) {
  const { user } = useContext(UserContext);
  const [mutualFriends, setMutualFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);

  useEffect(() => {
    if (!user?._id) return;

    let cancelled = false;

    const fetchFriends = async () => {
      setLoadingFriends(true);
      try {
        const res = await axios.get(`/api/users/mutuals?userId=${user._id}`);
        if (!cancelled && res.data) {
          const sanitized = res.data.filter((e) => e._id !== user._id);
          const notFollowedYet = sanitized.filter((f) => !f.isFollowed);
          setMutualFriends(notFollowedYet);
        }
      } catch (e) {
        console.error("Error fetching mutuals:", e);
      } finally {
        if (!cancelled) setLoadingFriends(false);
      }
    };

    fetchFriends();
    return () => {
      cancelled = true;
    };
  }, [user?._id]);

  return (
    <section
      className="w-full min-w-0 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm ring-1 ring-slate-950/5 sm:p-5"
      aria-labelledby="mutuals-heading"
    >
      <header
        id="mutuals-heading"
        className="mb-4 border-b border-slate-100 pb-4"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          Social
        </p>
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          Mutual friends
        </h2>
        <p className="mt-1 text-xs leading-snug text-slate-600 sm:text-[13px]">
          People you might know
        </p>
      </header>

      <ul className="flex w-full min-w-0 flex-col gap-3 sm:gap-4">
        {loadingFriends ? (
          Array.from({ length: 4 }).map((_, index) => (
            <li
              key={index}
              className="flex min-h-[4.75rem] w-full animate-pulse items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="size-14 shrink-0 rounded-full bg-slate-200" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 max-w-[10rem] rounded bg-slate-200" />
                <div className="h-3 max-w-[6rem] rounded bg-slate-100" />
              </div>
              <div className="h-9 w-20 shrink-0 rounded-lg bg-slate-200 sm:w-24" />
            </li>
          ))
        ) : mutualFriends.length > 0 ? (
          mutualFriends.map((friend) => (
            <li key={friend._id} className="list-none">
              <SingleMutual friend={friend} />
            </li>
          ))
        ) : (
          <li className="rounded-xl bg-slate-50/90 px-4 py-10 text-center text-sm text-slate-600">
            No mutual friend suggestions yet. Follow people to fill this list.
          </li>
        )}
      </ul>
    </section>
  );
}

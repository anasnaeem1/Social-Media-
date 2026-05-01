import axios from "axios";
import ExploreUsers from "./exploreUsers/exploreUsers";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useLocation } from "react-router-dom";
import UsersBirthdaysPage from "./usersBirtdaysPage/usersBirthdaysPage";
import { getAllUsers } from "../../../apiCalls";

const PICKER_HERO_IMG =
  "https://res.cloudinary.com/datcr1zua/image/upload/v1741051663/uploads/mynakqwx8ap1am70fwqq.png";

/** Phones: tight horizontal padding + safe-area inset for notched home indicators. */
const LAYOUT_SHELL =
  "mx-auto flex w-full min-w-0 max-w-[1120px] flex-col px-3 pb-[calc(3rem+env(safe-area-inset-bottom,0px))] pt-3 min-[400px]:px-4 sm:px-5 sm:pb-12 sm:pt-6 lg:px-6 lg:pt-8";

function SectionCard({ eyebrow, title, subtitle, iconClass, children }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-900/5 sm:rounded-2xl">
      <header className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 bg-slate-50/90 px-3 py-3 sm:gap-3 sm:px-5 sm:py-5">
        <div className="flex min-w-0 flex-1 items-start gap-2 sm:gap-3">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 text-base text-white shadow-inner sm:h-11 sm:w-11 sm:rounded-xl sm:text-lg ${iconClass ?? ""}`}
            aria-hidden
          >
            <i className="ri-team-line" />
          </span>
          <div className="min-w-0 flex-1">
            {eyebrow && (
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 sm:text-[11px]">
                {eyebrow}
              </p>
            )}
            <h2 className="text-base font-semibold tracking-tight text-slate-900 sm:text-xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </header>
      <div className="min-h-0 min-w-0 overflow-x-hidden p-3 sm:p-5">
        {children}
      </div>
    </section>
  );
}

export default function FriendsPage() {
  const location = useLocation();
  const { user: currentUser } = useContext(UserContext);
  const [followRequestUsers, setFollowRequestUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const isFriendsListPage = location.pathname.startsWith("/friends/list");
  const isBirthdayPage = location.pathname.startsWith("/friends/birthdays");
  const isFriendsRequestPage =
    location.pathname.startsWith("/friends/requests");

  const isSidebarPickerRoutes = isFriendsRequestPage || isFriendsListPage;

  useEffect(() => {
    if (!currentUser?._id) return;

    let cancelled = false;

    const load = async () => {
      setUsersLoading(true);
      try {
        const [followRes, allUsersRes] = await Promise.all([
          axios.get(`/api/users/followRequests/${currentUser._id}`),
          getAllUsers(currentUser._id),
        ]);

        const followRequestUsersPayload = followRes.data ?? [];
        const filtered = allUsersRes.filter(
          (u) =>
            !followRequestUsersPayload.some((req) => req?._id === u?._id)
        );

        if (!cancelled) {
          setFollowRequestUsers(followRequestUsersPayload);
          setAllUsers(filtered);
        }
      } catch (error) {
        console.error("Error fetching friends data:", error);
      } finally {
        if (!cancelled) setUsersLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [currentUser._id]);

  if (isBirthdayPage) {
    return (
      <div
        className={`${LAYOUT_SHELL} items-center pb-[calc(4rem+env(safe-area-inset-bottom,0px))]`}
      >
        <div className="w-full min-w-0">
          <UsersBirthdaysPage />
        </div>
      </div>
    );
  }

  if (isSidebarPickerRoutes) {
    const subtitle = isFriendsListPage
      ? "Choose someone in your friend list from the sidebar to open their profile here."
      : "Choose a request from the sidebar to preview that person’s profile here.";

    return (
      <div className={LAYOUT_SHELL}>
        <article className="mx-auto flex w-full max-w-[min(100%,28rem)] min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-md ring-1 ring-slate-900/5 sm:max-w-xl sm:rounded-2xl">
          <div
            className="aspect-[5/4] max-h-[200px] w-full shrink-0 bg-slate-200 bg-cover bg-center min-[400px]:aspect-video min-[400px]:max-h-[220px] sm:aspect-[2/1] sm:max-h-none sm:min-h-[160px]"
            style={{ backgroundImage: `url(${PICKER_HERO_IMG})` }}
            aria-hidden
          />
          <div className="min-w-0 space-y-1.5 px-4 pb-6 pt-4 sm:space-y-2 sm:px-8 sm:py-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600 min-[400px]:text-xs">
              Friends
            </p>
            <h1 className="text-lg font-semibold leading-snug text-slate-900 text-balance sm:text-2xl">
              {isFriendsListPage ? "Friend list" : "Follow requests"}
            </h1>
            <p className="max-w-md text-pretty text-xs leading-relaxed text-slate-600 min-[400px]:text-sm sm:text-base">
              {subtitle}
            </p>
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-[11px] leading-snug text-amber-900 ring-1 ring-amber-200/80 min-[400px]:text-xs lg:hidden">
              On phones, open the menu (avatar) → Friends to reach your list.
            </p>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className={`${LAYOUT_SHELL} gap-4 sm:gap-8`}>
      <SectionCard
        eyebrow="Inbox"
        title="Follow requests"
        subtitle="Accept or decline people who asked to connect with you."
        iconClass="from-blue-600 to-blue-800"
      >
        <ExploreUsers
          followReq
          users={followRequestUsers}
          usersLoading={usersLoading}
        />
      </SectionCard>

      <SectionCard
        eyebrow="Discover"
        title="People you may know"
        subtitle="Based on everyone else on the network—tap a card to learn more."
        iconClass="from-emerald-600 to-teal-800"
      >
        <ExploreUsers allUsers users={allUsers} usersLoading={usersLoading} />
      </SectionCard>
    </div>
  );
}

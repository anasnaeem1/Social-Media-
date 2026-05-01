import { useContext, useEffect, useState } from "react";
import Mutuals from "../Mutuals/mutuals";
import { UserContext } from "../../context/UserContext";
import { getBirthdayFriends } from "../../../apiCalls";

const GIFT_IMG =
  "https://res.cloudinary.com/datcr1zua/image/upload/v1738545241/uploads/eidjo4mpfimaifk2wxdu.avif";

function Others({ mainItems }) {
  const { user, dispatch, birthdayFriends: cached } = useContext(UserContext);
  const [birthdayFriends, setBirthdayFriends] = useState([]);

  useEffect(() => {
    if (!user?._id) return;

    const load = async () => {
      try {
        if (cached?.length > 0) {
          setBirthdayFriends(cached);
          return;
        }
        const list = await getBirthdayFriends(user._id);
        if (Array.isArray(list)) {
          const shuffled = [...list].sort(() => Math.random() - 0.5);
          setBirthdayFriends(shuffled);
          dispatch({ type: "UPDATEBIRTHDAYFRIENDS", payload: shuffled });
        }
      } catch (e) {
        console.log("Error fetching birthdays:", e);
      }
    };
    load();
  }, [user?._id, dispatch, cached]);

  return (
    <aside
      className="relative hidden min-h-0 w-full max-w-none shrink-0 xl:flex lg:w-[clamp(288px,min(100%,32vw),26rem)] lg:min-w-[288px] lg:flex-col xl:w-[min(100%,26rem)] xl:max-w-[26rem]"
      aria-label="Contacts and birthdays"
      style={{ maxHeight: "calc(100vh - 65px)" }}
    >
      {/* Scroll owns height so mutual rows get maximal vertical space inside column */}
      <div
        className="custom-scrollbar flex max-h-[calc(100vh-73px)] min-h-0 flex-col gap-6 overflow-x-hidden overflow-y-auto pb-8 pt-2 lg:sticky lg:top-[73px]"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {Array.isArray(birthdayFriends) && birthdayFriends.length > 0 && (
          <div className="flex w-full min-w-0 items-start gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm ring-1 ring-slate-950/5">
            <img
              src={GIFT_IMG}
              alt=""
              className="h-14 w-14 shrink-0 -rotate-6 rounded-full object-contain opacity-95"
              loading="lazy"
            />
            <p className="min-w-0 flex-1 text-[13px] leading-snug text-slate-700 sm:text-sm">
              <span className="font-semibold text-blue-700">
                {birthdayFriends.length === 1 ? "Only " : ""}
                {birthdayFriends[0].fullname}
              </span>{" "}
              <span className="font-semibold text-blue-700">
                {birthdayFriends.length > 1
                  ? `and ${birthdayFriends.length - 1} other friend${
                      birthdayFriends.length - 1 > 1 ? "s" : ""
                    }`
                  : ""}
              </span>{" "}
              <span className="text-slate-600">have a birthday today.</span>{" "}
              <span aria-hidden>🎉</span>
            </p>
          </div>
        )}

        <div className="min-h-0 w-full min-w-0 flex-1">
          <Mutuals mainItems={mainItems} />
        </div>
      </div>
    </aside>
  );
}

export default Others;

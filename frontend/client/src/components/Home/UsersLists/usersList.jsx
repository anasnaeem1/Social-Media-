import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { getUserFriends } from "../../../apiCalls";
import UsersListSkeleton from "./userListSkeleton";
import SingleUser from "./singleUser";

function normalizeUserList(payload) {
  if (!Array.isArray(payload)) return [];
  return payload.filter((u) => u && u._id);
}

function UsersList({ isFriendsListPage, isFriendsRequestPage }) {
  const { user: currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?._id || (!isFriendsRequestPage && !isFriendsListPage)) {
      setUserList([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        let raw = [];

        if (isFriendsRequestPage) {
          const { data } = await axios.get(`/api/users/followRequests/${currentUser._id}`);
          raw = data;
        } else if (isFriendsListPage) {
          raw = await getUserFriends(uid);
        }

        if (!cancelled) {
          setUserList(normalizeUserList(raw));
        }
      } catch (error) {
        console.error("UsersList fetch:", error);
        if (!cancelled) setUserList([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [currentUser?._id, isFriendsRequestPage, isFriendsListPage]);

  return (
    <ul className="flex min-w-0 flex-col gap-2" role="list">
      {isLoading ? (
        <>
          {[1, 2].map((k) => (
            <UsersListSkeleton
              key={`s-${k}`}
              isFriendsListPage={isFriendsListPage}
              isFriendsRequestPage={isFriendsRequestPage}
            />
          ))}
        </>
      ) : userList.length > 0 ? (
        userList.map((u) => (
          <li key={u._id} className="list-none">
            <SingleUser
              isFriendsListPage={isFriendsListPage}
              isFriendsRequestPage={isFriendsRequestPage}
              user={u}
            />
          </li>
        ))
      ) : (
        <li className="list-none rounded-xl border border-dashed border-slate-200 bg-white/80 px-4 py-8 text-center">
          <p className="text-base font-semibold text-slate-800">
            No{" "}
            {isFriendsRequestPage ? "follow requests" : "friends"} here yet
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
            {isFriendsRequestPage
              ? "When someone asks to connect, they will appear in this list."
              : "Add friends from Explore or Friend requests to fill this list."}
          </p>
          {!isFriendsRequestPage ? (
            <button
              type="button"
              onClick={() => navigate("/friends")}
              className="mt-6 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Go to Friends
            </button>
          ) : null}
        </li>
      )}
    </ul>
  );
}

export default UsersList;

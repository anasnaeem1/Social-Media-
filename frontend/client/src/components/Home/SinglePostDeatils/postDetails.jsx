import React, { useContext, useState } from "react";
import UserPhoto from "../../userPhoto";
import { UserContext } from "../../context/UserContext";
import PostButton from "../feed/post/postButton";
import { FeedContext } from "../../context/FeedContext";
import { format } from "timeago.js";
import CommentBox from "../feed/post/comments/commentBox";
import CommentSumbitForm from "../feed/post/comments/commentSubmitForm";

function postDetails({ post, postUser }) {
  const [isPostDescHide, setIsPostDescHide] = useState(true);
  const { user } = useContext(UserContext);
  const { setActivePostId, activePostId } = useContext(FeedContext);

  const isOpen = Boolean(post?._id && activePostId === post._id);
  const searchInput = "";

  const highlightText = (text, searchTerm) => {
    if (!text) return "";
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={`${part}-${index}`} className="text-blue-600">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleSeeMore = (e) => {
    e.preventDefault();
    setIsPostDescHide((v) => !v);
  };

  const handleBackToHome = () => setActivePostId("");

  return (
    <div aria-hidden={!isOpen}>
      {/* Backdrop */}
      <div
        role="presentation"
        aria-hidden={!isOpen}
        data-state={isOpen ? "open" : "closed"}
        onClick={isOpen ? handleBackToHome : undefined}
        className={`fixed inset-0 z-[190] bg-slate-900/55 backdrop-blur-[2px] transition-opacity duration-200 ${
          isOpen ?
            "cursor-pointer opacity-100"
          : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="post-detail-title"
        className={`fixed inset-x-0 bottom-0 z-[200] mx-auto flex w-full flex-col rounded-t-[1.35rem] border border-slate-200/80 bg-white shadow-[0_-16px_48px_-12px_rgba(15,23,42,0.35)] transition-[opacity,transform,visibility] duration-200 ease-out sm:inset-auto sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:h-[min(92dvh,840px)] sm:w-[min(920px,calc(100vw-28px))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:shadow-xl ${
          isOpen ?
            `pointer-events-auto visible max-h-[100dvh] translate-y-0 opacity-100 sm:max-h-[min(92dvh,840px)]`
          : `pointer-events-none invisible max-h-[100dvh] translate-y-[8px] opacity-0 sm:invisible sm:translate-y-[calc(-50%+8px)]`
        }`}
      >
        <span className="mx-auto mt-2 h-1 w-11 shrink-0 rounded-full bg-slate-300/70 sm:hidden" />

        {/* Top bar: identity + dismiss */}
        <header className="relative z-[2] shrink-0 border-b border-slate-100 px-3 pb-3 pt-1 sm:p-4 sm:pb-4">
          <div className="flex items-start gap-3">
            {!post ?
              <>
                <div className="h-11 w-11 shrink-0 rounded-full bg-slate-100" />
                <div className="min-w-0 flex-1 space-y-2 pt-1">
                  <div className="h-4 w-[45%] max-w-[10rem] rounded bg-slate-100" />
                  <div className="h-3 w-[26%] max-w-[5rem] rounded bg-slate-100" />
                </div>
              </>
            :
              <>
                {postUser && (
                  <div className="shrink-0">
                    <UserPhoto userId={postUser._id} user={postUser} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h1
                    id="post-detail-title"
                    className="truncate font-semibold text-slate-900 sm:text-[17px]"
                  >
                    {postUser?.fullname ?? "Someone"}
                  </h1>
                  <p className="text-xs text-slate-500 tabular-nums">
                    {post?.createdAt ?
                      `${format(post.createdAt)} · Post`
                    : "Loading…"}
                  </p>
                </div>
              </>
            }

            <button
              type="button"
              onClick={handleBackToHome}
              className="-mr-1 -mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-transparent text-slate-600 transition-colors hover:bg-slate-100 active:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              aria-label="Close"
            >
              <i className="ri-arrow-left-line text-xl leading-none md:hidden" />
              <i className="ri-close-line hidden text-xl leading-none md:block" />
            </button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom,0px)] [scrollbar-width:thin]"
            style={{ scrollbarGutter: "stable" }}
          >
            {/* Caption */}
            {!post ?
              <div className="mx-4 my-5 space-y-2">
                <div className="h-4 w-full rounded-md bg-slate-100" />
                <div className="h-4 w-[88%] rounded-md bg-slate-100" />
              </div>
            : (
              <>
                {post.desc ?
                  (() => {
                    const maxLen = post.img ? 260 : 400;
                    const desc = post.desc;
                    const isLong = desc.length > maxLen;
                    const preview = (() => {
                      const trimmed = desc.slice(0, maxLen);
                      const cut = trimmed.lastIndexOf(" ");
                      return cut > 0 ? `${trimmed.slice(0, cut)}…` : `${trimmed}…`;
                    })();

                    return (
                      <div className="mx-4 mt-4 text-[15px] leading-relaxed text-slate-800">
                        {isLong && isPostDescHide ?
                          <>
                            <span className="whitespace-pre-wrap break-words">
                              {highlightText(preview, searchInput)}
                            </span>{" "}
                            <button
                              type="button"
                              onClick={handleSeeMore}
                              className="align-baseline text-[15px] font-semibold text-blue-600 hover:text-blue-700"
                            >
                              See more
                            </button>
                          </>
                        : (
                          <span className="whitespace-pre-wrap break-words">
                            {highlightText(desc, searchInput)}
                            {isLong ?
                              <>
                                {" "}
                                <button
                                  type="button"
                                  onClick={handleSeeMore}
                                  className="align-baseline text-[15px] font-semibold text-blue-600 hover:text-blue-700"
                                >
                                  See less
                                </button>
                              </>
                            : null}
                          </span>
                        )}
                      </div>
                    );
                  })()
                : null}

                {post.img ?
                  <div className="mx-4 mb-5 mt-4">
                    <div className="overflow-hidden rounded-xl border border-slate-100 bg-slate-950/5">
                      <img
                        src={post.img}
                        alt=""
                        className="mx-auto block max-h-[min(52dvh,480px)] w-full object-contain"
                      />
                    </div>
                  </div>
                : null}

                <div className="mx-4 border-t border-slate-100 px-1 py-4 sm:px-0">
                  <PostButton post={post} postUser={postUser} postDetails />
                </div>

                <div className="border-t border-slate-100 pb-28 sm:pb-32">
                  <CommentBox
                    post={post}
                    postDetails
                    userId={user._id}
                    postUser={postUser}
                  />
                </div>
              </>
            )}
          </div>

          {post ?
            <div className="shrink-0 border-t border-slate-100 bg-white/95 px-3 py-3 backdrop-blur-sm sm:p-4 [padding-bottom:max(14px,env(safe-area-inset-bottom))]">
              <div className="mx-auto max-w-full">
                <CommentSumbitForm post={post} isPostPage={isOpen} />
              </div>
            </div>
          : null}
        </div>
      </div>
    </div>
  );
}

export default postDetails;

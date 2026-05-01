import { format } from "timeago.js";
import {
  RiArrowLeftLine,
  RiThumbUpFill,
  RiThumbUpLine,
} from "react-icons/ri";
import CommentBox from "../../Home/feed/post/comments/commentBox";
import CommentSumbitForm from "../../Home/feed/post/comments/commentSubmitForm";
import ReplySection from "./replySection/replySection";
import UserPhoto from "../../userPhoto";

function LikeRow({ likes, isLiked, onLike, disabled }) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-200/90 pt-4">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onLike();
        }}
        disabled={disabled}
        aria-pressed={isLiked}
        className={`inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors disabled:opacity-50 ${
          isLiked
            ? "bg-blue-50 text-blue-600"
            : "text-slate-600 hover:bg-slate-100 active:bg-slate-200"
        }`}
      >
        {isLiked ? (
          <RiThumbUpFill className="text-xl shrink-0" aria-hidden />
        ) : (
          <RiThumbUpLine className="text-xl shrink-0" aria-hidden />
        )}
        <span className="tabular-nums">{likes ?? 0}</span>
        <span className="hidden text-slate-500 font-normal sm:inline lowercase">
          {(likes ?? 0) === 1 ? "like" : "likes"}
        </span>
      </button>
    </div>
  );
}

function AuthorSkeleton() {
  return (
    <div className="flex gap-3 animate-pulse" aria-busy="true">
      <div className="h-11 w-11 shrink-0 rounded-full bg-slate-200" />
      <div className="min-w-0 flex-1 space-y-3 py-0.5">
        <div className="h-4 w-[40%] max-w-[12rem] rounded bg-slate-200" />
        <div className="h-3 w-[26%] max-w-[6rem] rounded bg-slate-200" />
        <div className="space-y-2">
          <div className="h-3 rounded bg-slate-100" />
          <div className="h-3 w-[94%] rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

/** Right panel on View Photo: meta, likes, post comments (+ composer) or comment thread + composer. */
export default function CommentSection({
  photoDetails,
  photoUser,
  photoDetailsLoading,
  photoUserLoading,
  isLiked,
  likes,
  likeHandler,
  isPostDescHide,
  handleSeeMore,
  forPost,
  forComment,
  replies,
  replyText,
  replyPicture,
  replyPicPreview,
  handleReplyImageChange,
  handleReplySubmit,
  handleRemoveReplyPic,
  handleBackClick,
  user,
  viewPhoto,
  highlightReplyId,
  isLiking,
}) {
  const title = forPost ? "Post" : forComment ? "Comment" : "Photo";
  const busy = Boolean(photoDetailsLoading || photoUserLoading);
  const rawDesc =
    typeof photoDetails?.desc === "string"
      ? photoDetails.desc.trim()
      : "";

  /** ~4 lines collapsed on desktop */
  const longPostDesc = rawDesc.length > 220;
  const shortDescPreview =
    longPostDesc ? `${rawDesc.slice(0, 200)}…` : rawDesc;

  const contextLabel =
    viewPhoto === "post"
      ? "Post detail"
      : viewPhoto === "comment"
        ? "Comment thread"
        : "Photo";

  return (
    <div className="flex min-h-full min-h-0 flex-col bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 shrink-0 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center gap-1 px-2 py-2 sm:px-3 sm:py-3">
          <button
            type="button"
            onClick={handleBackClick}
            className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full text-slate-800 hover:bg-slate-100 active:bg-slate-200 transition-colors"
            aria-label="Back"
          >
            <RiArrowLeftLine className="text-2xl" />
          </button>
          <div className="min-w-0 flex-1 pl-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 truncate">
              {contextLabel}
            </p>
            <h2 className="truncate text-[17px] font-bold leading-snug">{title}</h2>
          </div>
        </div>
      </header>

      <div
        className={`min-h-0 flex-1 overflow-y-auto overscroll-y-contain ${
          forComment ? "pb-2 lg:pb-4" : "pb-24 lg:pb-6"
        }`}
      >
        <div className="mx-auto max-w-xl px-3 py-4 sm:px-4 sm:py-5 lg:py-6">
          {busy ? (
            <AuthorSkeleton />
          ) : photoDetails && photoUser ? (
            <>
              <div className="flex gap-3">
                <div className="shrink-0">
                  <UserPhoto userId={photoDetails.userId} user={photoUser} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                    <p className="font-semibold leading-tight">
                      {photoUser.fullname ?? "Someone"}
                    </p>
                    {photoDetails.createdAt != null ? (
                      <span className="text-xs text-slate-500">
                        {format(photoDetails.createdAt)}
                      </span>
                    ) : null}
                  </div>
                  {forPost && rawDesc ? (
                    <div className="mt-2 space-y-1">
                      <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-slate-800">
                        {longPostDesc && isPostDescHide
                          ? shortDescPreview
                          : rawDesc}
                      </p>
                      {longPostDesc ? (
                        <button
                          type="button"
                          onClick={handleSeeMore}
                          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                          {isPostDescHide ? "See more" : "See less"}
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                  {forComment ? (
                    <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-slate-800">
                      {photoDetails.text ?? ""}
                    </p>
                  ) : null}
                  {forComment && photoDetails.img ? (
                    <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100/70">
                      <img
                        src={photoDetails.img}
                        alt="Attachment"
                        className="mx-auto block max-h-60 w-auto max-w-full object-contain sm:max-h-[min(380px,50vh)]"
                      />
                    </div>
                  ) : null}
                </div>
              </div>
              <LikeRow
                likes={likes}
                isLiked={isLiked}
                onLike={likeHandler}
                disabled={!!isLiking}
              />
            </>
          ) : !busy ? (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
              Could not load details.
            </p>
          ) : null}

          {!busy && forPost && photoDetails?._id ? (
            <section className="mt-8 space-y-4 border-t border-slate-100 pt-8">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Add a comment
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Your comment appears below for anyone who opens this photo.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <CommentSumbitForm ViewPhoto post={photoDetails} />
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 bg-slate-50/90 px-3 py-3 sm:px-4">
                  <h3 className="text-base font-bold text-slate-900">
                    All comments
                  </h3>
                </div>
                <CommentBox
                  post={photoDetails}
                  postUser={photoUser}
                  userId={user?._id}
                  ViewPhoto
                />
              </div>
            </section>
          ) : null}

          {!busy && forComment ? (
            <section className="mt-8 space-y-3 border-t border-slate-100 pt-8">
              <div className="flex flex-wrap items-baseline gap-2">
                <h3 className="text-base font-bold text-slate-900">Replies</h3>
                {replies?.length ? (
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {replies.length} total
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">
                    Nobody has replied yet
                  </span>
                )}
              </div>
              {replies?.length ? (
                <ReplySection
                  replies={replies}
                  highlightReplyId={highlightReplyId}
                  viewPhoto
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center">
                  <p className="text-sm text-slate-500">
                    No replies yet. Use the composer below—your reply will show
                    up here instantly.
                  </p>
                </div>
              )}
            </section>
          ) : null}
        </div>
      </div>

      {forComment ? (
        <footer className="sticky bottom-0 z-40 shrink-0 border-t border-slate-200 bg-white">
          <form
            onSubmit={handleReplySubmit}
            className="space-y-2 px-3 py-3 shadow-[0_-12px_32px_-20px_rgba(15,23,42,0.35)] sm:px-4"
          >
            {replyPicture && replyPicPreview ? (
              <div className="flex flex-wrap items-center gap-3">
                <img
                  src={replyPicPreview}
                  alt="Preview"
                  className="h-16 w-16 rounded-xl border border-slate-200 object-cover"
                />
                <button
                  type="button"
                  className="text-sm font-semibold text-red-600 hover:text-red-700"
                  onClick={handleRemoveReplyPic}
                >
                  Remove photo
                </button>
              </div>
            ) : null}
            <label className="sr-only" htmlFor="viewphoto-reply-field">
              Write a reply
            </label>
            <textarea
              ref={replyText}
              id="viewphoto-reply-field"
              placeholder="Write a reply…"
              rows={forComment ? 2 : 1}
              className="max-h-[200px] min-h-[48px] w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-3 text-[15px] outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200/80"
              style={{ scrollbarWidth: "thin" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  handleReplySubmit(e);
                }
              }}
            />
            <div className="flex flex-wrap items-stretch gap-2 sm:flex-nowrap">
              <label className="flex min-h-[48px] min-w-[48px] cursor-pointer shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 transition-colors">
                <span className="sr-only">Attach image</span>
                <i className="ri-image-add-line text-xl text-slate-600" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleReplyImageChange}
                />
              </label>
              <button
                type="submit"
                className="min-h-[48px] min-w-[88px] flex-1 shrink-0 rounded-xl bg-blue-600 px-5 text-[15px] font-bold text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 transition-colors sm:flex-none sm:min-w-[100px]"
              >
                Reply
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Ctrl+Enter to send · Shift+Enter for a new line · Long-press /
              pinch images to zoom elsewhere
            </p>
          </form>
          <div className="h-[env(safe-area-inset-bottom,0)]" aria-hidden />
        </footer>
      ) : null}
    </div>
  );
}

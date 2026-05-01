import { useContext, useEffect, useRef, useState } from "react";
import { format } from "timeago.js";
import {
  RiThumbUpLine,
  RiMore2Line,
  RiThumbUpFill,
  RiReplyLine,
} from "react-icons/ri";
import UserPhoto from "../../userPhoto";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import ReplySection from "./replySection/replySection";
import { getUser, uploadPhoto } from "../../../apiCalls";

function SingleComment({ comment }) {
  const [replies, setReplies] = useState([]);
  const [repliesVisibility, setRepliesVisibility] = useState(false);
  const [commentUser, setCommentUser] = useState(null);
  const { user } = useContext(UserContext);
  const [userFetching, setUserFetching] = useState(true);
  const [likes, setLikes] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likingComment, setLikingComment] = useState(false);
  const [replyPicture, setReplyPicture] = useState(null);
  const [replyPicPreview, setReplyPicPreview] = useState(null);
  const [highlightReplyId, setHighlightReplyId] = useState(null);
  const replyText = useRef();

  useEffect(() => {
    if (!highlightReplyId) return undefined;
    const t = setTimeout(() => setHighlightReplyId(null), 1200);
    return () => clearTimeout(t);
  }, [highlightReplyId]);

  useEffect(() => {
    let cancel = false;
    const fetchUser = async () => {
      try {
        if (!comment?.userId) return;
        setUserFetching(true);
        const u = await getUser(comment?.userId, 0);
        if (!cancel) setCommentUser(u);
      } catch {
        console.warn("comment user fetch failed");
      } finally {
        if (!cancel) setUserFetching(false);
      }
    };
    fetchUser();
    return () => {
      cancel = true;
    };
  }, [comment?.userId, comment]);

  useEffect(() => {
    if (!Array.isArray(comment?.likes)) return;
    setIsLiked(comment?.likes.includes(user?._id));
    setLikes(comment?.likes.length);
  }, [comment?.likes, user?._id]);

  useEffect(() => {
    let cancel = false;
    const fetchReplies = async () => {
      try {
        if (!comment?._id) return;
        const repliesRes = await axios.get(
          `/api/commentsReplies/${comment?._id}`
        );
        if (!cancel && repliesRes.data) setReplies(repliesRes.data);
      } catch (e) {
        console.warn("replies:", e.message);
      }
    };
    fetchReplies();
    return () => {
      cancel = true;
    };
  }, [comment?._id]);

  const handleCommentLike = async (e) => {
    e.preventDefault();
    if (likingComment) return;

    setLikingComment(true);
    const userId = user._id;

    try {
      await axios.put(`/api/comments/${comment._id}/likeComment`, {
        userId,
      });

      setLikes(isLiked ? likes - 1 : likes + 1);
      setIsLiked(!isLiked);
    } catch (error) {
      console.warn(error.message);
    } finally {
      setLikingComment(false);
    }
  };

  const handleRepliesVisibility = (e) => {
    e.preventDefault();
    setRepliesVisibility((v) => !v);
  };

  const handleReplyImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReplyPicture(file);
    setReplyPicPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleRemoveReplyPic = () => {
    if (replyPicPreview) URL.revokeObjectURL(replyPicPreview);
    setReplyPicture(null);
    setReplyPicPreview(null);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    try {
      const text = replyText.current?.value?.trim() ?? "";
      let uniqueFileName = null;
      if (replyPicture) uniqueFileName = await uploadPhoto(replyPicture);

      if (!text && !uniqueFileName) return;
      if (!user._id || !comment?._id) return;

      const payload = {
        userId: user._id,
        commentId: comment._id,
        text,
        img: uniqueFileName || undefined,
      };

      const commentResponse = await axios.post(`/api/commentsReplies`, payload);
      replyText.current.value = "";
      handleRemoveReplyPic();

      const created = commentResponse.data;
      if (created?._id) {
        setHighlightReplyId(created._id);
        setReplies((prevReplies) => [...prevReplies, created]);
        setTimeout(() => {
          document.getElementById(`reply-${created._id}`)?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }, 80);
      }
    } catch (error) {
      console.error(error.response?.data || error.message || error);
      alert("Failed to submit reply. Please try again.");
    }
  };

  if (!commentUser || userFetching) {
    return (
      <div className="animate-pulse border-b border-gray-100 px-3 py-5">
        <div className="flex gap-3">
          <div className="h-11 w-11 shrink-0 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-1/3 rounded bg-gray-200" />
            <div className="h-3 w-full rounded bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="border-b border-gray-100 px-3 py-4 sm:px-4">
      <div className="flex gap-3">
        <UserPhoto userId={comment?.userId} user={commentUser} />
        <div className="min-w-0 flex-1">
          <header className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold leading-tight text-gray-900">
                {commentUser?.fullname ?? "Someone"}
              </p>
              {comment.createdAt ?
                <p className="mt-0.5 text-[11px] text-gray-500">
                  {format(comment.createdAt)}
                </p>
              : null}
            </div>
            <RiMore2Line
              className="cursor-pointer text-gray-400 hover:text-gray-700"
              aria-hidden
            />
          </header>
          <p className="mt-2 break-words text-[15px] leading-snug text-gray-800">
            {comment.text}
          </p>
          {comment.img ?
            <div className="mt-3 overflow-hidden rounded-2xl border border-gray-200">
              <img
                src={comment.img}
                alt=""
                className="mx-auto block max-h-60 w-auto max-w-full object-contain"
              />
            </div>
          : null}

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-700">
            <button
              type="button"
              onClick={handleCommentLike}
              disabled={likingComment}
              className={`flex min-h-[44px] items-center gap-2 text-[15px] font-medium hover:text-blue-600 disabled:opacity-50 ${
                isLiked ? "text-blue-600" : "text-gray-600"
              }`}
            >
              {isLiked ? <RiThumbUpFill aria-hidden /> : <RiThumbUpLine aria-hidden />}
              {likes > 0 ? <span>{likes}</span> : null}
            </button>

            <button
              type="button"
              onClick={handleRepliesVisibility}
              className="flex min-h-[44px] items-center gap-1 text-[15px] font-medium text-gray-700 hover:text-blue-600"
            >
              <RiReplyLine aria-hidden /> Reply
            </button>
          </div>

          {replies?.length && !repliesVisibility ?
            <button
              type="button"
              onClick={handleRepliesVisibility}
              className="mt-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View {replies.length}{" "}
              {replies.length === 1 ? "reply" : "replies"}
            </button>
          : null}

          {repliesVisibility ?
            <div className="mt-4 space-y-4">
              <div className="border-l-2 border-slate-200 pl-2 sm:pl-3">
                {replies?.length ?
                  <ReplySection
                    replies={replies}
                    highlightReplyId={highlightReplyId}
                    viewPhoto={false}
                  />
                : (
                  <p className="pl-2 text-sm text-gray-500">
                    No replies yet. Say something below.
                  </p>
                )}
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3">
                <form
                  onSubmit={handleReplySubmit}
                  className="flex flex-col gap-3"
                >
                  {replyPicture && replyPicPreview ?
                    <div className="flex flex-wrap items-center gap-3">
                      <img
                        src={replyPicPreview}
                        alt=""
                        className="h-16 w-16 rounded-lg border object-cover"
                      />
                      <button
                        type="button"
                        className="text-sm font-semibold text-red-600 hover:text-red-700"
                        onClick={handleRemoveReplyPic}
                      >
                        Remove
                      </button>
                    </div>
                  : null}
                  <textarea
                    ref={replyText}
                    placeholder={`Reply to ${commentUser?.fullname?.split(" ")?.[0] ?? ""}…`}
                    rows={2}
                    maxLength={400}
                    className="min-h-[48px] w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        !e.shiftKey &&
                        (e.ctrlKey || e.metaKey)
                      ) {
                        e.preventDefault();
                        handleReplySubmit(e);
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2">
                    <label className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50">
                      <i className="ri-image-add-line text-xl text-gray-600" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleReplyImageChange}
                      />
                    </label>
                    <button
                      type="submit"
                      className="min-h-[40px] flex-1 rounded-lg bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700 sm:flex-none"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          : null}
        </div>
      </div>
    </article>
  );
}

export default SingleComment;

import Reply from "../../../Home/feed/post/comments/reply";

/** Thread list for View Photo comment mode; scroll anchors use `#reply-{id}`. */
function ReplySection({ replies, highlightReplyId, viewPhoto }) {
  const isVp = !!viewPhoto;

  if (!Array.isArray(replies) || replies.length === 0) return null;

  return (
    <div
      className={
        isVp
          ? "divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          : "mt-2 border-l-2 border-slate-300 pl-4"
      }
    >
      {replies.map((reply) => (
        <div
          key={reply._id}
          id={`reply-${reply._id}`}
          className={isVp ? "min-w-0" : undefined}
        >
          <Reply
            reply={reply}
            newReply={highlightReplyId === reply._id}
            viewPhoto={isVp}
          />
        </div>
      ))}
    </div>
  );
}

export default ReplySection;

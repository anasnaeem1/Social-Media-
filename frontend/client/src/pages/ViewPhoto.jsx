import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../components/context/UserContext";
import CommentSection from "../components/viewPhoto/commentSection/commentSection";
import { getUser, uploadPhoto } from "../apiCalls";
import PostButton from "../components/Home/feed/post/postButton";
import {
  VIEW_PHOTO_COMMENTS_ACTIVE,
  VIEW_PHOTO_COMMENTS_QP,
} from "../constants/viewPhoto";

function ViewPhoto() {
  const { viewPhoto, photoId } = useParams();
  const { dispatch, user } = useContext(UserContext);
  const [isLg, setIsLg] = useState(() =>
    typeof window !== "undefined" ?
      window.matchMedia("(min-width: 1024px)").matches
    : false,
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();
  const [photoDetails, setPhotoDetails] = useState(null);
  const [photoUser, setPhotoUser] = useState(null);
  const [likes, setLikes] = useState(null);
  const [photoDetailsLoading, setPhotoDetailsLoading] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [photoUserLoading, setPhotoUserLoading] = useState(false);
  const [isPostDescHide, setIsPostDescHide] = useState(true);
  const [forPost, setForPost] = useState(false);
  const [forComment, setForComment] = useState(false);
  const [replies, setReplies] = useState([]);
  const [replyPicture, setReplyPicture] = useState(null);
  const [replyPicPreview, setReplyPicPreview] = useState(null);
  const [highlightReplyId, setHighlightReplyId] = useState(null);
  const replyText = useRef();

  const mobileCommentsOpen =
    !isLg &&
    searchParams.get(VIEW_PHOTO_COMMENTS_QP) === VIEW_PHOTO_COMMENTS_ACTIVE;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setIsLg(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /** Desktop: drop `?comments=1` (sidebar always shows). */
  useEffect(() => {
    if (!isLg) return;
    if (searchParams.get(VIEW_PHOTO_COMMENTS_QP) !== VIEW_PHOTO_COMMENTS_ACTIVE)
      return;
    const next = new URLSearchParams(searchParams);
    next.delete(VIEW_PHOTO_COMMENTS_QP);
    setSearchParams(next, { replace: true });
  }, [isLg, searchParams, setSearchParams]);

  /** Keep global flag in sync for navbar / other listeners. */
  useEffect(() => {
    if (isLg) {
      dispatch({ type: "TOGGLE_PHOTO_COMMENTS", payload: false });
      return;
    }
    dispatch({
      type: "TOGGLE_PHOTO_COMMENTS",
      payload: mobileCommentsOpen,
    });
  }, [dispatch, isLg, mobileCommentsOpen]);

  useEffect(() => {
    setForPost(viewPhoto === "post");
    setForComment(viewPhoto === "comment");
  }, [viewPhoto]);

  useEffect(() => {
    let cancel = false;
    const fetchReplies = async () => {
      if (!forComment || !photoId) {
        setReplies([]);
        return;
      }
      try {
        const repliesRes = await axios.get(`/api/commentsReplies/${photoId}`);
        if (!cancel && repliesRes.data) setReplies(repliesRes.data);
      } catch (error) {
        if (!cancel) console.warn("Reply fetch failed:", error.message);
      }
    };
    fetchReplies();
    return () => {
      cancel = true;
    };
  }, [photoId, forComment]);

  useEffect(() => {
    let cancelled = false;
    const fetchPhotoDetails = async () => {
      if (!(forPost || forComment) || !photoId) {
        return;
      }
      try {
        setPhotoDetailsLoading(true);
        const res =
          forPost ?
            await axios.get(`/api/posts/getPost/${photoId}`)
          : await axios.get(`/api/comments/singleComment/${photoId}`);
        if (cancelled) return;
        setPhotoDetails(res.data);
        if (Array.isArray(res.data?.likes)) setLikes(res.data.likes.length);
      } catch (error) {
        if (!cancelled) console.warn("Photo detail fetch failed:", error.message);
      } finally {
        if (!cancelled) setPhotoDetailsLoading(false);
      }
    };
    fetchPhotoDetails();
    return () => {
      cancelled = true;
    };
  }, [photoId, forPost, forComment]);

  useEffect(() => {
    if (Array.isArray(photoDetails?.likes)) {
      setIsLiked(photoDetails.likes.includes(user._id));
      setLikes(photoDetails.likes.length);
    }
  }, [photoDetails?.likes, user._id]);

  useEffect(() => {
    let cancelled = false;
    const fetchUser = async () => {
      if (!photoDetails?.userId) {
        setPhotoUser(null);
        return;
      }
      try {
        setPhotoUserLoading(true);
        const userRes = await getUser(photoDetails.userId, 0);
        if (!cancelled) setPhotoUser(userRes);
      } catch (e) {
        if (!cancelled) console.warn("User fetch:", e.message);
      } finally {
        if (!cancelled) setPhotoUserLoading(false);
      }
    };
    fetchUser();
    return () => {
      cancelled = true;
    };
  }, [photoDetails?.userId]);

  useEffect(() => {
    if (!highlightReplyId) return;
    const t = setTimeout(() => setHighlightReplyId(null), 1200);
    return () => clearTimeout(t);
  }, [highlightReplyId]);

  const dismissCommentsQuery = () => {
    const next = new URLSearchParams(searchParams);
    next.delete(VIEW_PHOTO_COMMENTS_QP);
    setSearchParams(next, { replace: true });
  };

  const likeHandler = async () => {
    if (isLiking || !photoDetails?._id) return;

    setIsLiking(true);
    const userId = user._id;
    try {
      if (forPost) {
        await axios.put(`/api/posts/${photoDetails._id}/like`, { userId });
      } else if (forComment) {
        await axios.put(`/api/comments/${photoDetails._id}/likeComment`, {
          userId,
        });
      }
      setLikes(Math.max(0, (likes ?? 0) + (isLiked ? -1 : 1)));
      setIsLiked(!isLiked);
    } catch (error) {
      console.warn(error.message);
    } finally {
      setIsLiking(false);
    }
  };

  const handleSeeMore = (e) => {
    e.preventDefault();
    setIsPostDescHide((prev) => !prev);
  };

  const handleBackToPost = () => {
    dismissCommentsQuery();
    navigate(-1);
    dispatch({ type: "UNRELOAD", payload: false });
    dispatch({ type: "TOGGLE_PHOTO_COMMENTS", payload: false });
  };

  const handleReplyImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReplyPicture(file);
    setReplyPicPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    try {
      let uniqueFileName = null;

      if (replyPicture) {
        uniqueFileName = await uploadPhoto(replyPicture);
      }

      if (
        forComment &&
        user._id &&
        photoId &&
        replyText.current &&
        (replyText.current.value.trim() || uniqueFileName)
      ) {
        const payload = {
          userId: user._id,
          commentId: photoId,
          text: replyText.current.value.trim() || "",
          img: uniqueFileName || undefined,
        };

        const commentResponse = await axios.post(`/api/commentsReplies`, payload);
        replyText.current.value = "";

        const created = commentResponse.data;
        if (created?._id) {
          setHighlightReplyId(created._id);
          setReplies((prev) => [...prev, created]);
          setReplyPicture(null);
          if (replyPicPreview) URL.revokeObjectURL(replyPicPreview);
          setReplyPicPreview(null);

          setTimeout(() => {
            document.getElementById(`reply-${created._id}`)?.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
          }, 80);
        }
      }
    } catch (error) {
      console.error(error.response?.data || error.message || error);
      alert("Failed to submit reply. Please try again.");
    }
  };

  const handleRemoveReplyPic = () => {
    if (replyPicPreview) URL.revokeObjectURL(replyPicPreview);
    setReplyPicPreview(null);
    setReplyPicture(null);
  };

  /** Comment header back: phones — leave comment route and return to image; lg — exit viewer. */
  const handleToolbarBack = (e) => {
    e.preventDefault();
    dismissCommentsQuery();
    dispatch({ type: "TOGGLE_PHOTO_COMMENTS", payload: false });
    if (isLg) {
      dispatch({ type: "UNRELOAD", payload: false });
      navigate(-1);
    }
  };

  const showImageStage = isLg || !mobileCommentsOpen;
  const showCommentPanel = isLg || mobileCommentsOpen;

  return (
    <div className="relative flex h-[100dvh] w-full min-h-0 overflow-hidden bg-slate-950">
      {/* Image stage */}
      <div
        className={`relative min-h-0 flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-[#050910] via-[#0f172a] to-[#0c1222] ${
          showImageStage ? "flex" : "hidden"
        }`}
      >
        {photoDetailsLoading ? (
          <div className="aspect-[4/5] h-[72dvh] max-h-[780px] w-[88%] max-w-3xl animate-pulse rounded-2xl bg-slate-800/80 shadow-2xl" />
        ) : photoDetails?.img ? (
          <img
            src={photoDetails.img}
            alt=""
            className="pointer-events-none max-h-[calc(100dvh-220px)] w-full max-w-[min(100%,1100px)] select-none px-4 object-contain lg:max-h-[min(92dvh,calc(100dvh-80px))] lg:rounded-3xl lg:shadow-2xl lg:shadow-black/50"
          />
        ) : (
          <p className="rounded-xl bg-black/35 px-4 py-2 text-[15px] text-slate-200">
            Saving image preview…
          </p>
        )}

        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 lg:hidden" />

        {!mobileCommentsOpen && (
          <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(14px,env(safe-area-inset-bottom))] lg:hidden">
            <PostButton
              photoDetails={photoDetails}
              post={photoDetails}
              postUser={photoUser}
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleBackToPost}
          aria-label="Close fullscreen"
          className={`fixed right-3 top-[calc(env(safe-area-inset-top,0)+76px)] z-40 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/15 bg-black/55 text-xl text-white shadow-lg backdrop-blur-md transition hover:bg-black/65 active:scale-95 sm:right-5 sm:text-2xl lg:absolute lg:right-5 lg:top-5 lg:backdrop-blur ${
            mobileCommentsOpen ? "hidden" : ""
          }`}
        >
          <i className="ri-close-line" />
        </button>
      </div>

      {/* Comments / sidebar */}
      <div
        className={`flex min-h-0 shrink-0 flex-col overflow-hidden border-l border-slate-200/70 bg-white shadow-xl ${
          isLg ?
            `w-[min(432px,40vw)] flex-none`
          : showCommentPanel ?
            `w-full flex-1`
          : `hidden`
        }`}
      >
        <CommentSection
          photoDetails={photoDetails}
          photoUser={photoUser}
          photoDetailsLoading={photoDetailsLoading}
          photoUserLoading={photoUserLoading}
          isLiked={isLiked}
          likes={likes}
          likeHandler={likeHandler}
          isPostDescHide={isPostDescHide}
          handleSeeMore={handleSeeMore}
          forPost={forPost}
          forComment={forComment}
          replies={replies}
          replyText={replyText}
          replyPicture={replyPicture}
          replyPicPreview={replyPicPreview}
          handleReplyImageChange={handleReplyImageChange}
          handleReplySubmit={handleReplySubmit}
          handleRemoveReplyPic={handleRemoveReplyPic}
          handleBackClick={handleToolbarBack}
          user={user}
          viewPhoto={viewPhoto}
          highlightReplyId={highlightReplyId}
          isLiking={isLiking}
        />
      </div>
    </div>
  );
}

export default ViewPhoto;

import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import * as mainItems from "../../../../constants/index";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { format } from "timeago.js";
// import PostSkeleton from "../../../../Skeleton/postSkeleton";
import { UserContext } from "../../../context/UserContext";
import Comment from "./comments/Comment";
import UserPhoto from "../../../userPhoto";
// import { submittingComment } from "../../../../../apiCalls";
import CurrentUserPhoto from "../../../currentUserPhoto";
import { YourNewComment } from "../../../context/UserActions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CommentBox from "./comments/commentBox";
import PostSkeleton from "../../../Skeleton/postSkeleton";
import { getUser } from "../../../../apiCalls";
import PostButton from "./postButton";
import { FeedContext } from "../../../context/FeedContext";
import PostDetails from "../../SinglePostDeatils/postDetails";

function Post({ post, userId, searchInput, isBackNavigation }) {
  const {
    dispatch,
    commentBox,
    user,
    postId: removedPostId,
  } = useContext(UserContext);
  const { updatePostWithPermission, activePostId } = useContext(FeedContext);
  const { Friends, Shares } = mainItems;
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [postUser, setPostUser] = useState({});
  const navigate = useNavigate();
  const [userLoading, setUserLoading] = useState(true);
  const [isImg, setIsImg] = useState(false);
  const params = useParams();
  const [isMoreOptionVisible, setIsMoreOptionVisible] = useState(false);
  const [postDesc, setPostDesc] = useState(false);
  const [isPostHide, setIsPostHide] = useState(false);
  const [postIsVisibleAgain, setPostIsVisibleAgain] = useState(false);
  const [isPostDescHide, setIsPostDescHide] = useState(true);
  // const { postId } = useParams();
  const dropdownRef = useRef(null);
  const optionButtonRef = useRef(null);
  /** Fixed-position rect for portaled menu (escapes post `overflow-hidden`). */
  const [menuRect, setMenuRect] = useState(null);

  const computeMenuPosition = useCallback(() => {
    const el = optionButtonRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const gap = 8;
    const width = Math.min(350, window.innerWidth - gap * 2);
    let left = rect.right - width;
    if (left < gap) left = gap;
    if (left + width > window.innerWidth - gap) {
      left = window.innerWidth - gap - width;
    }
    const preferredBelow = rect.bottom + gap;
    const spaceBelow = window.innerHeight - preferredBelow - gap;
    const spaceAbove = rect.top - gap * 2;
    const menuMax = 440;
    if (spaceBelow >= 180 || spaceBelow >= spaceAbove) {
      return {
        top: preferredBelow,
        left,
        width,
        maxHeight: Math.min(menuMax, Math.max(120, spaceBelow)),
      };
    }
    const maxH = Math.min(menuMax, Math.max(120, spaceAbove));
    return {
      top: Math.max(gap, rect.top - maxH - gap),
      left,
      width,
      maxHeight: maxH,
    };
  }, []);

  useLayoutEffect(() => {
    if (!isMoreOptionVisible) {
      setMenuRect(null);
      return;
    }
    const apply = () => setMenuRect(computeMenuPosition());
    apply();
    window.addEventListener("resize", apply);
    window.addEventListener("scroll", apply, true);
    return () => {
      window.removeEventListener("resize", apply);
      window.removeEventListener("scroll", apply, true);
    };
  }, [isMoreOptionVisible, computeMenuPosition]);

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        optionButtonRef.current &&
        !optionButtonRef.current.contains(event.target)
      ) {
        setIsMoreOptionVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setUserLoading(true);
        const user = await getUser(post?.userId, 0);
        setPostUser(user);
        setUserLoading(false);
      } catch (error) {
        console.log("Error fetching user", error);
      }
    };
    fetchUser();
  }, [post.userId, post.likes, user._id]);

  useEffect(() => {
    if (post?.img) {
      setIsImg(true);
    }
  }, [post.userId, post]);

  const highlightText = (text, searchTerm) => {
    if (typeof text !== "string") text = String(text); // Ensure input is a string
    if (!searchTerm) return text; // If no search term, return original text

    // Escape special regex characters in searchTerm
    const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedSearchTerm})`, "gi");

    const parts = text.split(regex); // Split text at search term

    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="text-blue-500">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleMoreOptions = (e) => {
    e.preventDefault();
    setIsMoreOptionVisible((prev) => !prev);
  };

  const handleRemovePostAlert = (e) => {
    e.preventDefault();
    setIsPostHide(true);
  };

  const handleRemovePostUndo = (e) => {
    e.preventDefault();
    setPostIsVisibleAgain(true);
    setIsPostHide(false);
  };

  const handleRemovePost = (e) => {
    e.preventDefault();
    dispatch({
      type: "POSTID",
      payload: post._id,
    });
  };

  const handleSeeMore = (e) => {
    e.preventDefault();
    setIsPostDescHide(!isPostDescHide);
  };

  const handleDeletePost = (e) => {
    e.preventDefault();
    setIsMoreOptionVisible(false);
    dispatch({
      type: "TOGGLEFLOATINGBOX",
      payload: { disable: false, purpose: "deletePost", details: post },
    });
  };

  const handlePinPost = async (e) => {
    e.preventDefault();

    if (!user || !post) {
      toast.error("User or post data is missing.");
      return;
    }

    try {
      await updatePostWithPermission({
        postId: post._id,
        postUserId: post.userId,
        updates: { pinned: !post.pinned },
      });

      if (true) {
        setIsMoreOptionVisible(false);
        post.pinned = !post.pinned;
      }
    } catch (error) {
      console.error("Failed to pin the post:", error);
      toast.error("Failed to pin the post. Please try again.");
    }
  };

  return (
    <>
      <>
        {isPostHide ? (
          <div className="relative mx-auto flex w-full max-w-[540px] flex-col overflow-hidden rounded-2xl border border-gray-300 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.06)] md:w-[540px] space-y-3">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
            {/* Confirmation Message */}
            <>
              <div className="relative z-[1] text-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  Are you sure you want to remove this post?
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  This action cannot be undone. Please confirm your choice.
                </p>
              </div>

              {/* Buttons */}
              <div className="relative z-[1] mt-6 flex items-center justify-center gap-4">
                <button
                  className="px-6 py-2 bg-red-500 text-white font-medium rounded-lg shadow hover:bg-red-600 transition duration-200"
                  onClick={handleRemovePost}
                >
                  Remove
                </button>
                <button
                  className="px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg shadow hover:bg-gray-300 transition duration-200"
                  onClick={handleRemovePostUndo}
                >
                  Undo
                </button>
              </div>
            </>
          </div>
          // me : postIsVisibleAgain ? (
        ) : (
          <>
            <div
              className={`${userId ? "postSkeletonWidthForProfile" : ""
                } relative mx-auto flex w-full max-w-[540px] flex-col overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.06)] md:w-[540px] ${postIsVisibleAgain &&
                "animate__animated  animate__fadeIn bg-animate"
                }`}
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
              {!isBackNavigation && userLoading ? (
                isImg ? (
                  <PostSkeleton userId={userId} isImg={isImg} />
                ) : (
                  <PostSkeleton userId={userId} />
                )
              ) : (
                <div>
                  {/* POST OPTIONS — portaled so it is not clipped by the card */}
                  {isMoreOptionVisible &&
                    menuRect &&
                    createPortal(
                      <>
                        <button
                          type="button"
                          tabIndex={-1}
                          aria-hidden
                          className="fixed inset-0 z-[259] cursor-default bg-slate-950/40 backdrop-blur-[2px]"
                          onClick={() => setIsMoreOptionVisible(false)}
                        />
                        <div
                          ref={dropdownRef}
                          role="menu"
                          aria-label="Post options"
                          style={{
                            position: "fixed",
                            top: menuRect.top,
                            left: menuRect.left,
                            width: menuRect.width,
                            maxHeight: menuRect.maxHeight,
                          }}
                          className="z-[260] flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_22px_60px_-12px_rgba(15,23,42,0.35)] ring-1 ring-slate-900/5"
                        >
                          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/80 to-transparent" />

                          <button
                            type="button"
                            onClick={() => setIsMoreOptionVisible(false)}
                            className="absolute right-2.5 top-2.5 z-[1] grid h-10 w-10 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 active:scale-95"
                            aria-label="Close menu"
                          >
                            <i className="ri-close-line text-xl" />
                          </button>

                          <header className="shrink-0 border-b border-slate-100 bg-gradient-to-b from-slate-50/90 to-white px-4 pb-4 pt-3 pr-14">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                              This post
                            </p>
                            <h3 className="mt-0.5 text-[17px] font-bold tracking-tight text-slate-900">
                              Options
                            </h3>
                            <p className="mt-1 text-[13px] leading-snug text-slate-500">
                              Pin, save, edit, or remove this post.
                            </p>
                          </header>

                          <div className="min-h-0 flex-1 divide-y divide-slate-100 overflow-y-auto overscroll-contain px-2 py-2 [scrollbar-width:thin]">
                            {post.userId === user._id && (
                              <button
                                type="button"
                                onClick={handlePinPost}
                                className="group flex w-full min-h-[52px] cursor-pointer items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-slate-50 active:bg-slate-100"
                              >
                                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100/80 transition group-hover:bg-blue-100/80">
                                  <i className="ri-pushpin-fill text-xl" />
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block text-[15px] font-semibold text-slate-800">
                                    {post.pinned ? "Unpin" : "Pin"} post
                                  </span>
                                  <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">
                                    Highlight at the top of your profile
                                  </span>
                                </span>
                                <i className="ri-arrow-right-s-line shrink-0 text-lg text-slate-300 transition group-hover:text-slate-400" />
                              </button>
                            )}

                            <button
                              type="button"
                              className="group flex w-full min-h-[52px] cursor-pointer items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-slate-50 active:bg-slate-100"
                            >
                              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100/80 transition group-hover:bg-emerald-100/80">
                                <i className="ri-bookmark-fill text-xl" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-[15px] font-semibold text-slate-800">
                                  Save post
                                </span>
                                <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">
                                  Add to your saved collection
                                </span>
                              </span>
                              <i className="ri-arrow-right-s-line shrink-0 text-lg text-slate-300 transition group-hover:text-slate-400" />
                            </button>

                            {post.userId === user._id && (
                              <button
                                type="button"
                                className="group flex w-full min-h-[52px] cursor-pointer items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-slate-50 active:bg-slate-100"
                              >
                                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-600 ring-1 ring-violet-100/80 transition group-hover:bg-violet-100/80">
                                  <i className="ri-edit-2-fill text-xl" />
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block text-[15px] font-semibold text-slate-800">
                                    Edit post
                                  </span>
                                  <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">
                                    Update text or media
                                  </span>
                                </span>
                                <i className="ri-arrow-right-s-line shrink-0 text-lg text-slate-300 transition group-hover:text-slate-400" />
                              </button>
                            )}

                            {post.userId === user._id && (
                              <button
                                type="button"
                                onClick={handleDeletePost}
                                className="group flex w-full min-h-[52px] cursor-pointer items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-red-50 active:bg-red-100/80"
                              >
                                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-red-50 text-red-600 ring-1 ring-red-100/80 transition group-hover:bg-red-100/90">
                                  <i className="ri-delete-bin-6-line text-xl" />
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block text-[15px] font-semibold text-red-800">
                                    Delete post
                                  </span>
                                  <span className="mt-0.5 block text-xs leading-relaxed text-red-600/80">
                                    Remove permanently from your feed
                                  </span>
                                </span>
                                <i className="ri-arrow-right-s-line shrink-0 text-lg text-red-200 transition group-hover:text-red-300" />
                              </button>
                            )}
                          </div>

                          <footer className="shrink-0 border-t border-slate-100 bg-slate-50/60 px-4 py-3">
                            <p className="text-center text-[12px] text-slate-500">
                              Need help?{" "}
                              <button
                                type="button"
                                className="font-semibold text-blue-600 underline-offset-2 hover:text-blue-700 hover:underline"
                              >
                                Contact support
                              </button>
                            </p>
                          </footer>
                        </div>
                      </>,
                      document.body,
                    )}
                  <div className="flex px-4 py-3 justify-between items-center">
                    <div className="flex items-center gap-3">
                      {/* User Photo */}
                      {userLoading ? (
                        <div className="w-[40px] h-[40px] bg-gray-300 rounded-full animate-pulse"></div> // Skeleton for user photo
                      ) : params === `/profile/${postUser._id}` ? (
                        postUser._id === user._id ? (
                          <CurrentUserPhoto />
                        ) : (
                          <UserPhoto userId={post.userId} user={postUser} />
                        )
                      ) : postUser._id === user._id ? (
                        <CurrentUserPhoto />
                      ) : (
                        <UserPhoto userId={post.userId} user={postUser} />
                      )}

                      {/* User Info */}
                      <div>
                        {userLoading ? (
                          <div className="w-[120px] h-[16px] bg-gray-300 rounded-md animate-pulse mb-1"></div> // Skeleton for the username
                        ) : (
                          <div
                            onClick={() => navigate(`/profile/${postUser._id}`)}
                            className="flex items-center gap-2"
                          >
                            <h1 className="cursor-pointer text-sm font-semibold text-gray-800">
                              {postUser.fullname}
                            </h1>
                            {/* Pinned Post Icon */}
                            {userId && post?.pinned && (
                              <i className="text-base text-gray-500 ri-pushpin-fill"></i>
                            )}
                          </div>
                        )}

                        {userLoading ? (
                          <div className="w-[80px] h-[10px] bg-gray-300 rounded-md animate-pulse"></div> // Skeleton for date
                        ) : (
                          <span className="text-xs text-gray-500">
                            {format(post.createdAt)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        ref={optionButtonRef}
                        onClick={handleMoreOptions}
                        className="flex justify-center items-center hover:bg-gray-100 w-8 h-8 rounded-full text-xl"
                      >
                        <i className="ri-more-line"></i>
                      </button>
                      <button
                        onClick={handleRemovePostAlert}
                        className="flex justify-center items-center hover:bg-gray-100 w-8 h-8 rounded-full text-xl"
                      >
                        <i className="ri-close-line"></i>
                      </button>
                    </div>
                  </div>

                  {/* Post Content */}
                  {post?.desc && (
                    <div
                      className={`${!post.img ? "text-lg py-2 md-text-lg" : "text-sm"
                        } px-4 md-text-sm text-start font-medium text-gray-800`}
                    >
                      {(() => {
                        const maxLength = post.img ? 89 : 150;
                        const isLongText = post.desc.length > maxLength;

                        // Function to replace \n with <br/>
                        const formatText = (text) => {
                          if (typeof text !== "string") {
                            return text;
                          }

                          return text.split("\n").map((line, index) => (
                            <React.Fragment key={index}>
                              {line}
                              <br />
                            </React.Fragment>
                          ));
                        };

                        if (isLongText && isPostDescHide) {
                          const trimmedText = post.desc.slice(0, maxLength);
                          const lastSpaceIndex = trimmedText.lastIndexOf(" ");
                          const finalText =
                            lastSpaceIndex > 0
                              ? trimmedText.slice(0, lastSpaceIndex) + "..."
                              : trimmedText + "...";

                          return (
                            <>
                              <span>{formatText(finalText)}</span>
                              <span
                                className="text-blue-500 cursor-pointer"
                                onClick={handleSeeMore}
                              >
                                See more...
                              </span>
                            </>
                          );
                        }

                        return (
                          <>
                            <span>
                              {formatText(
                                highlightText(post.desc, searchInput)
                              )}
                            </span>

                            {isLongText && (
                              <span
                                className="text-blue-500 cursor-pointer"
                                onClick={handleSeeMore}
                              >
                                Hide post...
                              </span>

                            )}
                          
                            </>
                        );
                      })()}
                    </div>
                  )}

                  {/* Image Section */}
                  {post.img && (
                    <Link to={`/photo/post/${post._id}`}>
                      <div className="mt-3 h-72 w-full overflow-hidden rounded-xl border border-gray-300 bg-gray-100">
                        <img
                          src={post.img}
                          alt="Post Image"
                          className="h-full w-full object-cover"
                        />
                      </div>

                    </Link>
                  )}
                  <PostButton postUser={postUser} post={post} />
                  {/* {
                    <CommentBox
                      // postId={postId}
                      post={post}
                      userId={userId}
                      postUser={postUser}
                    />
                  } */}
                  {activePostId === post._id && <PostDetails postId={activePostId} post={post} postUser={postUser} />}
                </div>
              )}
            </div>
          </>
        )}
      </>
    </>
  );
}

export default React.memo(Post);

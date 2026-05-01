import React from "react";
import { CircularProgress } from "@mui/material"; // Use Material UI for circular progress
import CreatePost from "./createPost/cPost";
import { useEffect, useState, memo, useContext, useRef } from "react";
import Post from "./post/post";
import PostSkeleton from "../../Skeleton/postSkeleton";
import { UserContext } from "../../context/UserContext";
import { FeedContext } from "../../context/FeedContext";

function Feed({
  currentUserPhoto,
  cPostFile,
  mainItems,
  SeperatingLine,
  userId,
  home,
}) {
  const { ShareOptions } = mainItems;
  const {
    reload,
    floatingBox,
    user,
    postId,
    dispatch,
    yourNewPost,
  } = useContext(UserContext);

  const {
    posts,
    isLoadingPosts,
    feedPost,
    prependPost,
    removePostById,
  } = useContext(FeedContext);

  // const PA = import.meta.env.VITE_PUBLIC_API;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isBackNavigation, setIsBackNavigation] = useState(false);
  const isFetching = isLoadingPosts;

  useEffect(() => {
    const backNavigation =
      window.history.state &&
      window.history.state.idx &&
      window.history.state.idx < window.history.length - 1;

    // Profile feed (used in Profile page)
    if (userId && !home) {
      feedPost({ profileUserId: userId, page: 1, limit: 5 })
        .then(({ hasMore: nextHasMore }) => setHasMore(nextHasMore))
        .catch(() => null);
      setIsBackNavigation(false);
      return;
    }

    // Home timeline feed
    if (reload) {
      setIsBackNavigation(false);
      dispatch({ type: "UNRELOAD", payload: false });
      setTimeout(() => window.scrollTo(0, 0), 0);
    } else {
      setIsBackNavigation(backNavigation);
    }

    feedPost({ profileUserId: null, page, limit: 5 })
      .then(({ hasMore: nextHasMore }) => setHasMore(nextHasMore))
      .catch(() => null);
  }, [reload, page, home, userId, dispatch, feedPost]);

  // Remove deleted post (triggered by floatingBox)
  useEffect(() => {
    if (floatingBox.purpose === "postDeleted" && floatingBox.result?._id) {
      removePostById(floatingBox.result._id);
    }
  }, [floatingBox.result, removePostById]);

  // Prepend newly created post
  useEffect(() => {
    if (yourNewPost) {
      prependPost(yourNewPost);
    }
  }, [yourNewPost, prependPost]);

  // Remove post when UserContext triggers POSTID removal
  useEffect(() => {
    if (postId) {
      removePostById(postId);
    }
  }, [postId, removePostById]);

  const handleLoadMore = () => {
    if (hasMore && !isFetching) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div
      className={`${
        !userId && "mx-0 md:mx-auto "
      } w-full  max-w-[550px] relative`}
    >
      {!userId && isFetching && (
        <div className="fixed top-0  left-0 right-0 z-50 flex justify-center items-center h-[65px] reload-slidein translate-y-[-70px]">
          <div className="bg-white h-[40px] w-[40px] flex justify-center items-center rounded-full shadow-lg border border-gray-200 reload-animation">
            <CircularProgress size={23} />
          </div>
        </div>
      )}

      <div className="flex w-full max-w-[550px]  relative mt-3 justify-center items-center flex-col gap-4 overflow-x-hidden">
        {userId && userId !== user._id ? (
          ""
        ) : (
          <CreatePost
            userId={userId}
            cPostFile={cPostFile}
            ShareOptions={ShareOptions}
            currentUserPhoto={currentUserPhoto}
            SeperatingLine={SeperatingLine}
          />
        )}
        {/* Display posts */}
        {posts.length > 0 ? (
          posts.map((post) => (
              <React.Fragment key={post._id}>
                {Array.isArray(post?.likes) && (
                  <Post
                    userId={userId}
                    isBackNavigation={isBackNavigation}
                    post={post}
                  />
                )}
              </React.Fragment>
          ))
        ) : (
          <div
            className={` bg-white mx-4 shadow-md border py-3 rounded-lg flex flex-col max-w-[540px] w-full sm:w-[540px] items-center justify-center gap-3`}
          >
            <div className="animate-spin w-10 h-10 border-4 border-gray-300 border-t-gray-500 rounded-full"></div>

            <p className="text-gray-500 text-sm font-medium">
              Loading posts, please wait...
            </p>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && !isFetching && (
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 bg-blue-500 text-white rounded mt-5"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
}

export default memo(Feed);

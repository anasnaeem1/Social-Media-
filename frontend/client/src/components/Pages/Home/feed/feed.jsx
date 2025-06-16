import React from "react";
import { CircularProgress } from "@mui/material"; // Use Material UI for circular progress
import CreatePost from "./createPost/cPost";
import { useEffect, useState, memo, useContext, useRef } from "react";
import Post from "./post/post";
import axios from "axios";
import PostSkeleton from "../../../Skeleton/postSkeleton";
import { UserContext } from "../../../context/UserContext";
import { setLoadedPosts } from "../../../context/UserActions";

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
    loadedPosts,
  } = useContext(UserContext);
  // const PA = import.meta.env.VITE_PUBLIC_API;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isBackNavigation, setIsBackNavigation] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const isReload =
      performance.getEntriesByType("navigation")[0]?.type === "reload";

    const backNavigation =
      window.history.state &&
      window.history.state.idx &&
      window.history.state.idx < window.history.length - 1;

    if (userId && !home) {
      fetchPosts();
      return;
    }
    if (reload) {
      setIsBackNavigation(false);
    } else if (loadedPosts.length > 0) {
      setIsBackNavigation(true);
      setPosts(loadedPosts);
      return;
    }

    if (reload) {
      setLoadedPosts([]);
      dispatch({ type: "UNRELOAD", payload: false });
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
    } else if (loadedPosts.length === 0) {
      fetchPosts();
    }
  }, [reload, page, home, userId, dispatch]);

  // Remove deleted post
  useEffect(() => {
    if (floatingBox.purpose === "postDeleted" && floatingBox.result?._id) {
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== floatingBox.result._id)
      );
    }
  }, [floatingBox.result]);

  const fetchPosts = async () => {
    setIsFetching(true);
    try {
      let res;
      if (userId) {
        res = await axios.get(`/api/posts/profile/${userId}`);
        setPosts(res.data);
        setHasMore(false);
        return;
      } else {
        res = await axios.get(
          `/api/posts/timeline/${user._id}?page=${page}&limit=5`
        );
        const randomizePosts = (array) => {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
          return array;
        };
        const fetchedPosts = randomizePosts(res.data);
        if (fetchedPosts) {
          setPosts(fetchedPosts);
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    setIsFetching(false);
  };

  useEffect(() => {
    if (!userId) {
      if (posts.length > 0) {
        dispatch({ type: "UPDATELOADEDPOST", payload: posts });
      }
    }
  }, [posts]);

  useEffect(() => {
    if (yourNewPost) {
      yourNewPost;
      setPosts((prevPosts) => [yourNewPost, ...prevPosts]);
    }
  }, [yourNewPost]);

  useEffect(() => {
    if (postId) {
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    }
  }, [postId]);

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

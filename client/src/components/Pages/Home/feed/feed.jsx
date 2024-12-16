import { CircularProgress } from "@mui/material"; // Use Material UI for circular progress
import CreatePost from "./createPost/cPost";
import { useEffect, useState, memo, useContext } from "react";
import Post from "./post/post";
import axios from "axios";
import PostSkeleton from "../../../Skeleton/postSkeleton";
import { AuthContext } from "../../../context/AuthContext";

function Feed({ currentUserPhoto, mainItems, SeperatingLine, userId }) {
  const { ShareOptions } = mainItems;
  const { reload, user, dispatch } = useContext(AuthContext);
  const PA = import.meta.env.VITE_PUBLIC_API;
  const [posts, setPosts] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch posts
  const fetchPosts = async () => {
    setIsFetching(true);

    try {
      let res;
      if (userId) {
        res = await axios.get(`${PA}/api/posts/profile/${userId}`);
        setPosts(res.data);
        setHasMore(false);
      } else {
        res = await axios.get(
          `${PA}/api/posts/timeline/${user._id}?page=${page}&limit=5`
        );
        const randomizePosts = (array) => {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
          return array;
        };
        const fetchedPosts = randomizePosts(res.data);
        setPosts((prev) =>
          page === 1 ? fetchedPosts : [...prev, ...fetchedPosts]
        );
        setHasMore(fetchedPosts.length > 0);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    setIsFetching(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [page, userId]);

  useEffect(() => {
    if (reload) {
      setPosts([]);
      fetchPosts();
      dispatch({ type: "UNRELOAD", payload: false }); // Reset reload state
    }
  }, [reload, page, dispatch]);

  const handleLoadMore = () => {
    if (hasMore && !isFetching) {
      setPage((prev) => prev + 1); // Increment page to fetch next set of posts
    }
  };

  return (
    <div className="relative">
      {/* Show loading indicator */}
      {isFetching && (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center h-[65px] reload-slidein translate-y-[-70px]">
          <div className="bg-white h-[40px] w-[40px] flex justify-center items-center rounded-full shadow-lg border border-gray-200 reload-animation">
            <CircularProgress size={23} />
          </div>
        </div>
      )}

      <div className="flex pt-5 items-center flex-col gap-10 overflow-x-hidden feed-container">
        {/* CreatePost section */}
        {userId ? (
          userId === user._id && (
            <CreatePost
              ShareOptions={ShareOptions}
              currentUserPhoto={currentUserPhoto}
              SeperatingLine={SeperatingLine}
            />
          )
        ) : (
          <CreatePost
            ShareOptions={ShareOptions}
            currentUserPhoto={currentUserPhoto}
            SeperatingLine={SeperatingLine}
          />
        )}

        {/* Display posts */}
        {posts.length > 0 ? (
          posts.map((post) => <Post post={post} key={post._id} />)
        ) : (
          <PostSkeleton />
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

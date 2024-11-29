import CreatePost from "./createPost/cPost";
import { useEffect, useState, memo, useContext } from "react";
import Post from "./post/post";
import axios from "axios";
import PostSkeleton from "../../../Skeleton/postSkeleton";
// import Skeleton from 'react-loading-skeleton'
import "react-loading-skeleton/dist/skeleton.css";
import { AuthContext } from "../../../context/AuthContext";

function feed({ UserPhoto, mainItems, SeperatingLine, userId }) {
  const { ShareOptions } = mainItems;
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const PA = import.meta.env.VITE_PUBLIC_API;

  // Fetching Timeline Posts
  console.log(userId)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = userId
          ? await axios.get(
              `${PA}/api/posts/profile/` + userId
            )
          : await axios.get(
              `${PA}/api/posts/timeline/${user._id}`
            );
        // console.log("Fetched posts:", res.data);
        const randomizedPosts = res.data.sort(() => Math.random() - 0.5);
        setPosts(randomizedPosts);
        setIsLoading(false);
      } catch (error) {
        console.error("Error at fetching", error);
      }
    };

    fetchPosts();
  }, [userId]);

  return (
    <div
      className={`flex pt-5 items-center flex-col gap-10 overflow-x-hidden feed-container`}
    >
      {userId ? (
        userId === user._id && (
          <CreatePost
            ShareOptions={ShareOptions}
            UserPhoto={UserPhoto}
            SeperatingLine={SeperatingLine}
          />
        )
      ) : (
        <CreatePost
          ShareOptions={ShareOptions}
          UserPhoto={UserPhoto}
          SeperatingLine={SeperatingLine}
        />
      )}

      {/* <CreatePost
        ShareOptions={ShareOptions}
        UserPhoto={UserPhoto}
        SeperatingLine={SeperatingLine}
      /> */}

      {isLoading &&
        Array.from({ length: 5 }).map((_, index) => (
          <PostSkeleton key={index} />
        ))}

      {posts.map((post) => (
        <Post post={post} key={post._id} />
      ))}
    </div>
  );
}

export default memo(feed);

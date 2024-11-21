import CreatePost from "./createPost/cPost";
import { useEffect, useState, memo, useContext } from "react";
import Post from "./post/post";
import axios from "axios";
import PostSkeleton from "../../../Skeleton/postSkeleton";
// import Skeleton from 'react-loading-skeleton'
import "react-loading-skeleton/dist/skeleton.css";
import { AuthContext } from "../../../context/AuthContext";

function feed({ UserPhoto, mainItems, SeperatingLine, username }) {
  const { ShareOptions } = mainItems;
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const {user} = useContext(AuthContext)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = username
          ? await axios.get(
              "http://localhost:8800/api/posts/profile/" + username
            )
          : await axios.get(
              `http://localhost:8800/api/posts/timeline/${user._id}`
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
  }, []);

  // if (!posts) return null;

  return (
    <div
      className={`flex pt-5 items-center flex-col gap-10 overflow-x-hidden feed-container`}
    >
      {/* <input className="border border-black" placeholder="testing..." type="text" onChange={e => setText(e.target.value)} /> */}
      <CreatePost
        ShareOptions={ShareOptions}
        UserPhoto={UserPhoto}
        SeperatingLine={SeperatingLine}
      />
      {isLoading &&
        Array.from({ length: 5 }).map((_, index) => (
          <PostSkeleton key={index} />
        ))}

      {posts.map((post) => (
        <Post post={post} key={post.id} />
      ))}

      {/*
      <Post
        Shares={Shares}
        Friends={Friends}
        ShareOptions={ShareOptions}
        UserPhoto={UserPhoto}
        SeperatingLine={SeperatingLine}
      />
      <Post
        Shares={Shares}
        Friends={Friends}
        ShareOptions={ShareOptions}
        UserPhoto={UserPhoto}
        SeperatingLine={SeperatingLine}
      /> */}
    </div>
  );
}

export default memo(feed);

import CreatePost from "./createPost/cPost";
import { useEffect, useState, memo } from "react";
import Post from "./post/post";
import axios from "axios";

function feed({ UserPhoto, mainItems, SeperatingLine , username }) {
  const { ShareOptions } = mainItems;
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = username
          ? await axios.get(
              "http://localhost:8800/api/posts/profile/" + username
            ) 
          : await axios.get(
              "http://localhost:8800/api/posts/timeline/673148ec2eb15da95ed0e4f3"
            );
        console.log("Fetched posts:", res.data);
        setPosts(res.data);
      } catch (error) {
        console.error("Error at fetching", error);
      }
    };

    fetchPosts();
  }, []);

  // if (!posts) return null;

  return (
    <div
      className={`flex pt-5 flex-col gap-10 overflow-x-hidden feed-container`}
    >
      {/* <input className="border border-black" placeholder="testing..." type="text" onChange={e => setText(e.target.value)} /> */}
      <CreatePost
        ShareOptions={ShareOptions}
        UserPhoto={UserPhoto}
        SeperatingLine={SeperatingLine}
      />
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

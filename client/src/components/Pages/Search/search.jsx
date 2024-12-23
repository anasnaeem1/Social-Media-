import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Post from "../Home/feed/post/post";
import { AuthContext } from "../../context/AuthContext";
import UserPhoto from "../../userPhoto";
import UserInfoSkeleton from "../../Skeleton/searchUserInfoSkeleton";
import { getUser } from "../../../apiCalls";

function Search() {
  const { dispatch, user: currentUser } = useContext(AuthContext);
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const PA = import.meta.env.VITE_PUBLIC_API;
  const [userIsLoading, setUserIsLoading] = useState(true);
  const [postsIsLoading, setPostsIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const userId = useParams().id;
  const [followed, setFollowed] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // Trigger loading states on userId change
  useEffect(() => {
    setUserIsLoading(true);
    setPostsIsLoading(true);
  }, [userId]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser(userId, 0);
        setUser(user);
        setUserIsLoading(false);
      } catch (error) {
        console.log("Error at fetching user:", error);
      }
    };
    fetchUser();
  }, [userId]);

  // Fetch user's posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${PA}/api/posts/profile/` + userId);
        const randomizedPosts = res.data.sort(() => Math.random() - 0.5);
        setPosts(randomizedPosts);
        setPostsIsLoading(false);
      } catch (error) {
        console.error("Error at fetching posts:", error);
      }
    };

    fetchPosts();
  }, [userId]);

  useEffect(() => {
    if (user._id && Array.isArray(currentUser.followings)) {
      const normalizedFollowings = currentUser.followings.map((id) =>
        id.toString()
      );
      const isFollowed = normalizedFollowings.includes(user._id.toString());
      setFollowed(isFollowed);
    }
  }, [currentUser.followings, user._id]);

  // Handle follow/unfollow actions
  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      if (followed) {
        await axios.put(`${PA}/api/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`${PA}/api/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <div className="h-[90vh] flex justify-start flex-col items-center py-7 overflow-x-auto">
      <div className="flex w-[600px] pt-5 justify-center items-center flex-col gap-10">
        {userIsLoading ? (
          <UserInfoSkeleton />
        ) : (
          <div className="bg-white w-full max-w-[533px] shadow-md border border-gray-200 rounded-lg overflow-hidden">
            {/* User Photo */}
            <div className="p-4 flex">
              <div className="overflow-hidden mr-4">
                <Link to={`/profile/${user._id}`}>
                  <UserPhoto userId={userId} user={user} />
                </Link>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-lg font-semibold text-gray-800">
                  {user.username}
                </h1>
                <p className="text-sm text-gray-600 mt-1">{user.bio}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              {userId === currentUser._id ? (
                ""
              ) : (
                <button
                  onClick={handleFollow}
                  className={`flex items-center gap-2 text-sm px-4 py-2 rounded-md ${
                    followed
                      ? "bg-gray-200 text-gray-600 hover:bg-gray-300"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  } transition-all duration-200`}
                >
                  <i
                    className={`ri-user-${
                      followed ? "unfollow" : "follow"
                    }-line text-lg`}
                  ></i>
                  {followed ? "Unfollow" : "Follow"}
                </button>
              )}

              <Link
                to={`/profile/${user._id}`}
                className="text-sm font-semibold text-blue-500 border border-blue-500 rounded-md py-2 px-4 hover:bg-blue-500 hover:text-white transition-all duration-200"
              >
                View Profile
              </Link>
            </div>
          </div>
        )}

        <div className="flex w-[550px] flex-col gap-2">
          {postsIsLoading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <UserInfoSkeleton key={idx} />
              ))
            : posts.map((post) => <Post post={post} key={post._id} />)}
        </div>
      </div>
    </div>
  );
}

export default Search;

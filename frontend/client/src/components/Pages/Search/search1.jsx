import { useParams, Link } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import Post from "../Home/feed/post/post";
import UserDetails from "./userDetails";

function Search1() {
  const PA = import.meta.env.VITE_PUBLIC_API;
  const { searchInput } = useParams();
  const { user: currentUser } = useContext(UserContext);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [decodedParams, setDecodedParams] = useState(null);
  const [searchedPosts, setSearchedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setDecodedParams(searchInput.replace(/-/g, " ") || searchInput);
  }, [searchInput]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setSearchedUsers([]);
      setSearchedPosts([]);

      // Fetch users
      try {
        const userResponse = await axios.get(
          `/api/search/user/${decodedParams}`
        );
        const userResponseData = userResponse.data || [];
        setSearchedUsers(userResponseData);
      } catch (userError) {
        console.error("Error fetching users:", userError);
      }

      // Fetch posts
      try {
        const postResponse = await axios.get(
          `/api/search/post/${decodedParams}`
        );
        const postResponseData = postResponse.data || [];
        setSearchedPosts(postResponseData);
      } catch (postError) {
        console.error("Error fetching posts:", postError);
      }

      // Fetch top three posts for each user (if users exist)
      // if (searchedUsers.length > 0) {
      //   try {
      //     const allUsersPosts = searchedUsers.map((user) =>
      //       axios.get(`/api/posts/topThreeRecentPosts/${user._id}`)
      //     );

      //     const postsResponses = await Promise.all(allUsersPosts);
      //     const usersTopThreePosts = postsResponses.flatMap(
      //       (response) => response.data
      //     );
      //     // Combine posts from search and user-specific posts
      //     setSearchedPosts((prevPosts) => [
      //       ...usersTopThreePosts,
      //       ...prevPosts,
      //     ]);
      //   } catch (userPostsError) {
      //     console.error("Error fetching user posts:", userPostsError);
      //   }
      // }

      setIsLoading(false);
    };

    if (decodedParams) {
      fetchData();
    }
  }, [decodedParams]);

  return (
    <div className="pt-5 search-box w-full max-w-full sm:max-w-[590px] border text-gray-800 sm:py-8 sm:px-6 bg-gradient-to-r from-blue-50 via-white to-blue-50">
      <div className="mb-6 text-center">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
          Search Results for:{" "}
          <span className="text-blue-600">{decodedParams}</span>
        </h1>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <div className="">
          {/* Users Section */}
          <section className="text-center">
            {searchedUsers && searchedUsers.length > 0 ? (
              <>
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-blue-700">
                  Users
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  {searchedUsers.map((eachUser) => (
                    <div
                      className="bg-white mx-auto relative shadow-md border border-gray-200 rounded-lg flex flex-col max-w-[540px] w-full my-2 "
                      key={eachUser?.username}
                    >
                      <UserDetails user={eachUser} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-gray-500">No users found</div>
            )}
          </section>

          {/* Posts Section */}
          <section className="text-center">
            {searchedPosts.length > 0 ? (
              <>
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-blue-700">
                  Posts
                </h2>
                <div className="space-y-4 sm:space-y-6 flex flex-col items-center">
                  {searchedPosts.map((post) => (
                    <React.Fragment key={post._id}>
                      <Post
                        userId={post.userId}
                        searchInput={decodedParams}
                        post={post}
                      />
                    </React.Fragment>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-gray-500">No posts found</div>
            )}
          </section>

          {/* No Results Found */}
          {searchedUsers.length === 0 && searchedPosts.length === 0 && (
            <div className="text-center text-gray-500">
              <p>No results found for your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Search1;

import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
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
    setIsLoading(true);
    setSearchedUsers([]);
    setSearchedPosts([]);

    const fetchUsers = async () => {
      try {
        const userResponse = await axios.get(
          `/api/search/user/${decodedParams}`
        );
        console.log("Users Response:", userResponse?.data);
        setSearchedUsers(userResponse?.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        setSearchedUsers([]); // Clear results on error
      }
    };

    const fetchPosts = async () => {
      try {
        const postResponse = await axios.get(
          `/api/search/post/${decodedParams}`
        );

        // console.log("Posts Response:", postResponse?.data);
        setSearchedPosts(postResponse?.data || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setSearchedPosts([]);
      }
    };

    if (decodedParams) {
      setIsLoading(true);
      setSearchedUsers([]);
      setSearchedPosts([]);

      fetchUsers();
      fetchPosts();

      setIsLoading(false); // This might need refinement if both calls affect loading state
    }
  }, [decodedParams]);

  return (
    <div className="pt-5 search-box w-full max-w-full sm:max-w-[550px] mx-auto border text-gray-800 py-6 px-3 sm:py-8 sm:px-6 bg-gradient-to-r from-blue-50 via-white to-blue-50">
      <div className="mb-6 text-center">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
          Search Results for:{" "}
          <span className="text-blue-600">{decodedParams}</span>
        </h1>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {/* Users Section */}
          <section className="text-center">
            {searchedUsers && searchedUsers.length > 0 ? (
              <>
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-blue-700">
                  Users
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  {searchedUsers.map((eachUser) => (
                    <div key={eachUser._id}>
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
                    <Post
                      userId={post.userId}
                      searchInput={decodedParams}
                      post={post}
                      key={post._id}
                    />
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

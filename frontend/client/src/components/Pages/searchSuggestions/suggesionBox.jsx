import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import UserPhoto from "../../userPhoto";
import axios from "axios";

function SuggestionBox() {
  const { dispatch, user, searchedInput } = useContext(UserContext);
  const [searchedUsers, setSearchedUsers] = useState(null);
  const [searchedPosts, setSearchedPosts] = useState(null);
  const [userIsLoading, setUserIsLoading] = useState(true);
  const PF = import.meta.env.VITE_PUBLIC_FOLDER || "/images/";
  const PA = import.meta.env.VITE_PUBLIC_API;
  const navigate = useNavigate();

  const handleNavigateToProfile = (userId) => {
    navigate(`/profile/${userId}`);
    dispatch({ type: "SEARCHEDINPUT", payload: "" });
  };

  useEffect(() => {
    const searchingUser = async () => {
      if (!searchedInput) {
        setSearchedUsers(null);
        setUserIsLoading(false);
        return;
      }

      try {
        setUserIsLoading(true); // Set loading state
        const userSearchRes = await axios.get(
          `/api/search/user/${searchedInput}`
        );
        if (userSearchRes.data && Array.isArray(userSearchRes.data)) {
          // console.log(user);
          setSearchedUsers(
            userSearchRes.data.length > 0 ? userSearchRes.data : null
          );
        } else {
          setSearchedUsers(null);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // console.log("No results found for the search query.");
          setSearchedUsers([]); // Empty array indicates no results
        } else {
          console.error("Error fetching users:", error);
          setSearchedUsers(null); // Handle other errors gracefully
        }
      } finally {
        setUserIsLoading(false); // Reset loading state
      }
    };

    searchingUser();
  }, [searchedInput]);

  useEffect(() => {
    const searchingPost = async () => {
      if (!searchedInput) {
        setSearchedUsers(null);
        setUserIsLoading(false);
        return;
      }
      console.log(searchedInput);

      try {
        setUserIsLoading(true); // Set loading state
        const postsSearchRes = await axios.get(
          `/api/search/post/${searchedInput}`
        );
        if (postsSearchRes.data && Array.isArray(postsSearchRes.data)) {
          // console.log(postsSearchRes.data);
          setSearchedPosts(
            postsSearchRes.data.length > 0 ? postsSearchRes.data : null
          );
        } else {
          setSearchedPosts(null);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("No results found for the search query.");
          setSearchedPosts([]); // Empty array indicates no results
        } else {
          // console.error("Error fetching users:", error);
          setSearchedPosts(null); // Handle other errors gracefully
        }
      } finally {
        setUserIsLoading(false); // Reset loading state
      }
    };

    searchingPost();
  }, [searchedInput]);

  return (
    <div
      className={`${searchedInput ? "w-full" : "tranform w-0"} 
      shadow-lg absolute top-0 left-0 z-10  bg-white
      transition-all duration-700 ease-in-out`}
    >
      {searchedInput && searchedPosts && searchedPosts.length > 0 && (
        <div className="border-b p-2">
          <div className="px-5 py-3 hover:bg-gray-50 flex justify-between">
            <p className="">{searchedInput}</p>
            <p className="text-blue-500 cursor-pointer">
              {searchedPosts.length} Results
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {userIsLoading && <p className="p-4 text-gray-500">Loading...</p>}

      {/* Results Found */}
      {!userIsLoading &&
        searchedInput &&
        searchedUsers &&
        searchedUsers.length > 0 && (
          <div className="border-b p-4">
            <ul className="">
              {searchedUsers.map((user) => (
                <li
                  key={user._id}
                  className="flex  cursor-pointer items-center justify-between py-4 hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => handleNavigateToProfile(user._id)}
                >
                  {/* User Info */}
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UserPhoto
                        userId={user._id}
                        user={user}
                        className="w-12 h-12 rounded-full object-cover border"
                      />
                    </div>
                    <div>
                      <h1 className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-300">
                        {user.username}
                      </h1>
                      <p className="hidden md:flex text-sm text-gray-600 mt-1 truncate">
                        {user.bio || "This user has no bio."}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3">
                    <button className="bg-blue-500 text-white text-sm font-medium px-4 py-1 rounded-md hover:bg-blue-600 transition duration-200">
                      <i class="flex md:hidden ri-user-follow-line"></i>
                      <span className="hidden md:flex">Follow</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the click event from bubbling up
                        handleNavigateToProfile(user._id); // Navigate on button click
                      }}
                      className="text-blue-500 hidden md:flex text-sm font-medium px-4 py-1 border border-blue-500 rounded-md hover:bg-blue-50 transition duration-200"
                    >
                      View Profile
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

      {/* No Results Found */}
      {!userIsLoading &&
        searchedPosts &&
        searchedPosts.length === 0 &&
        searchedUsers &&
        searchedInput &&
        searchedUsers.length === 0 && (
          <div className="p-8 flex justify-center items-center text-center">
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-gray-400 mx-auto mb-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 7.586l4.293-4.293a1 1 0 111.414 1.414L11.414 9l4.293 4.293a1 1 0 01-1.414 1.414L10 10.414l-4.293 4.293a1 1 0 11-1.414-1.414L8.586 9 4.293 4.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                No results found
              </h2>
              <p className="text-gray-500 text-sm">
                We couldn't find any users matching your search. Please try
                again with a different query.
              </p>
            </div>
          </div>
        )}
    </div>
  );
}

export default SuggestionBox;

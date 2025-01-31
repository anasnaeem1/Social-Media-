import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function SearchForMobile() {
  const [searchInputTransition, setSearchInputTransition] = useState(false);
  const { dispatch, searchedInput, mobileSearchInput } =
    useContext(UserContext);
  const navigate = useNavigate();
  const searchInputForMobile = useRef(null);

  const handleInputChangeForMobile = () => {
    if (searchInputForMobile.current) {
      const inputValue = searchInputForMobile.current.value || "";
      dispatch({ type: "SEARCHEDINPUT", payload: inputValue });
    }
  };

  useEffect(() => {
    if (!searchedInput) {
      if (searchInputForMobile.current) {
        searchInputForMobile.current.value = "";
      }
    } else {
      // setSearchInputVisible(true);
      dispatch({ type: "MOBILESEARCHINPUT", payload: true });
      searchInputForMobile.current.focus();
      searchInputForMobile.current.value = searchedInput;
    }
  }, [searchedInput, dispatch]);

  useEffect(() => {
    if (mobileSearchInput) {
      setTimeout(() => {
        setSearchInputTransition(true);
      }, 300);
    } else {
      setSearchInputTransition(false);
    }
  }, [mobileSearchInput]);

  const closeSearchInput = () => {
    // setSearchInputVisible(false);
    dispatch({ type: "MOBILESEARCHINPUT", payload: false });
    dispatch({ type: "SEARCHEDINPUT", payload: "" });
  };

  // const handleSearchClick = (e) => {
  //   e.preventDefault();
  //   // setSearchInputVisible(true);
  //   dispatch({ type: "MOBILESEARCHINPUT", payload: true });
  // };

  const handleSearchForMobile = (e) => {
    e.preventDefault();
    const input = searchInputForMobile.current?.value;

    if (input) {
      const formattedInput = input.trim().replace(/\s+/g, "-");
      navigate(`/search/${formattedInput}`);
      closeSearchInput();
    } else {
      console.log("Search input is not available");
    }
  };

  return (
    <div className="border-black w-full">
      <form
        onSubmit={handleSearchForMobile}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSearchForMobile(e);
          }
        }}
        className="relative flex items-center gap-2 transition-all duration-300 ease-in-out"
      >
        {/* Input Field */}
        <input
          ref={searchInputForMobile}
          onChange={handleInputChangeForMobile}
          type="text"
          placeholder="Search..."
          className={`w-full px-4 py-2 border border-gray-300 shadow-md rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out text-black ${
            searchInputTransition
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-2"
          }`}
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={closeSearchInput}
          className="w-[45px] h-[40px] flex items-center justify-center rounded-lg text-gray-700 transition-all duration-300 hover:bg-gray-200"
          aria-label="Close search"
        >
          <i className="ri-close-line text-lg"></i>
        </button>

        {/* Search Button */}
        <button
          type="submit"
          className="w-[55px] h-[40px] flex items-center justify-center rounded-full
           text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300"
        >
          <i className="ri-search-2-line text-xl"></i>
        </button>
      </form>
    </div>
  );
}

export default SearchForMobile;

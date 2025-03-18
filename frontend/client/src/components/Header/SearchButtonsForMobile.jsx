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
        className="relative flex w-full"
      >
        <div className="px-4 py-3 flex items-center  w-full border-b bg-white">
          <i className="ri-search-line text-gray-500 text-xl"></i>
          <input
            ref={searchInputForMobile}
            onChange={handleInputChangeForMobile}
            type="text"
            placeholder="Search..."
            className="ml-3 w-full outline-none bg-transparent text-gray-800 placeholder-gray-500"
          />
        </div>
      </form>
    </div>
  );
}

export default SearchForMobile;

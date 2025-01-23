import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { submittingPost } from "../../../../../apiCalls";
import { UserContext } from "../../../../context/UserContext";
import CurrentUserPhoto from "../../../../currentUserPhoto";

function cPost({ ShareOptions, cPostFile, userId, SeperatingLine }) {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER || "/images/";
  const PA = import.meta.env.VITE_PUBLIC_API;
  const { user, dispatch } = useContext(UserContext);
  const [postFile, setPostFile] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const desc = useRef();

  // console.log("userId", userId);

  const handlePostFileChange = (g) => {
    const selectedPostPic = g.target.files[0];
    if (!userId) {
      setPostFile(selectedPostPic);
      setPreviewImg(URL.createObjectURL(selectedPostPic));
      // console.log("File selected:", selectedPostPic);
    } else {
      if (!cPostFile) {
        return;
      }
      if (selectedPostPic && cPostFile) {
        setPostFile(selectedPostPic);
        setPreviewImg(URL.createObjectURL(selectedPostPic));
        // console.log("File selected:", selectedPostPic);
      }
    }
  };

  const postSubmit = async (e) => {
    e.preventDefault();

    try {
      let uniqueFileName = null;

      // Handle file upload if `postFile` is not null
      if (postFile) {
        const data = new FormData();
        data.append("file", postFile);

        const uploadResponse = await axios.post("/api/uploads", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        uniqueFileName = uploadResponse.data;
        console.log("Received unique filename:", uniqueFileName);
      }

      // Submit the post (with or without an image)
      const newPost = await submittingPost(
        user._id,
        desc.current.value,
        uniqueFileName,
        dispatch
      );
      console.log(newPost)
    } catch (error) {
      console.error(
        "An error occurred:",
        error.response?.data || error.message || error
      );
    }
  };

  const handleRemoveImage = () => {
    setPostFile(null);
    setPreviewImg(null);
  };

  return (
    <form
      onSubmit={postSubmit}
      className="bg-white mx-2 p-4 shadow-[0px_0px_15px_-10px_rgba(0,0,0,0.6)] border border-gray-200 rounded-lg flex flex-col gap-3 max-w-[540px] w-full"
    >
      <div className="flex  items-center gap-3 w-full">
        <div className="hidden sm:block">
          <CurrentUserPhoto />
        </div>
        <input
          ref={desc}
          className="py-2 w-full px-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-gray-300"
          placeholder={`What’s on your mind ${user.username}?`}
          type="text"
        />
      </div>
      <div className="w-full">
        <SeperatingLine color={"border-gray-300"} />
      </div>

      {/* Display uploaded image preview with edit/remove options */}
      {previewImg && postFile && (
        <div className="relative w-full h-[250px] bg-contain bg-no-repeat bg-center border rounded-md overflow-hidden">
          <div
            className="w-full h-[300px] bg-contain bg-no-repeat bg-center"
            style={{ backgroundImage: `url(${previewImg})` }}
          ></div>
          <div className="absolute top-2 right-2 flex gap-2">
            <label
              htmlFor="-uploadButtonForPostFile"
              className="text-white bg-blue-600 py-1 px-2 text-sm rounded cursor-pointer shadow hover:bg-blue-700"
            >
              Edit
              <input
                type="file"
                id="uploadButtonForPostFile"
                accept=".png,.jpg,.jpeg"
                onChange={handlePostFileChange}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="text-white bg-red-600 py-1 px-2 text-sm rounded cursor-pointer shadow hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      <ul className="flex justify-around items-center gap-3 w-full">
        <div className="flex justify-center items-center">
          <div className="flex justify-center items-center">
            <input
              encType="multipart/form-datas"
              onChange={handlePostFileChange}
              type="file"
              id="uploadButton"
              accept=".png,.jpg,.jpeg"
              className="hidden"
            />
            <label htmlFor="uploadButton" className=" flex items-center ">
              <span className="cursor-pointer text-blue-500 text-2xl mr-1">
                <i className="ri-image-ai-fill"></i>
              </span>
              <span className="text-gray-600  cursor-pointer sm:block hidden text-xs sm:text-base">
                Photo or Video
              </span>
            </label>
          </div>
        </div>

        <div className={`flex justify-center items-center`}>
          <li className={` cursor-pointer  text-red-500 text-2xl mr-1`}>
            <i className="ri-hashtag"></i>
          </li>
          <span
            className={`text-gray-600 cursor-pointer sm:block hidden text-xs sm:text-base`}
          >
            Tag
          </span>
        </div>

        <div className={`flex justify-center items-center`}>
          <li className={` cursor-pointer text-yellow-500 text-2xl mr-1`}>
            <i className="ri-emoji-sticker-line"></i>
          </li>
          <span
            className={`text-gray-600 cursor-pointer sm:block hidden text-xs sm:text-base`}
          >
            Feeling
          </span>
        </div>

        {/* {ShareOptions.map((option, id) => {
          const colorClasses = [
            "text-red-600",
            "text-blue-600",
            "text-green-600",
            "text-yellow-600",
          ];
          return (
          );
        })} */}

        <button
          type="submit"
          className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
        >
          Post
        </button>
      </ul>
    </form>
  );
}

export default cPost;

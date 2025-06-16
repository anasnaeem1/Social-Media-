import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { submittingPost } from "../../../../../apiCalls";
import { UserContext } from "../../../../context/UserContext";
import CurrentUserPhoto from "../../../../currentUserPhoto";

function cPost({ ShareOptions, cPostFile, userId, SeperatingLine }) {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER || "/images/";
  const PA = import.meta.env.VITE_PUBLIC_API;
  const { user, dispatch, yourNewPost } = useContext(UserContext);
  const [postFile, setPostFile] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [postSubmitting, setPostSubmitting] = useState(null);
  const [desc, setDesc] = useState("");
  const postDescRef = useRef();

  const handlePostFileChange = (g) => {
    const selectedPostPic = g.target.files[0];
    if (!userId) {
      setPostFile(selectedPostPic);
      setPreviewImg(URL.createObjectURL(selectedPostPic));
    } else {
      if (!cPostFile) {
        return;
      }
      if (selectedPostPic && cPostFile) {
        setPostFile(selectedPostPic);
        setPreviewImg(URL.createObjectURL(selectedPostPic));
      }
    }
  };

  const handlePostDescChange = (e) => {
    setDesc(e.target.value);
  };

  useEffect(() => {
    if (yourNewPost) {
      setDesc(""); // Clears the textarea when a new post is created
    }
  }, [yourNewPost]);

  const postSubmit = async (e) => {
    e.preventDefault();
    setPostSubmitting(true);
    try {
      const formattedDesc = desc?.replace(/\n/g, " /n ") || "";
      let uniqueFileName = null;
      if (postFile) {
        const data = new FormData();
        data.append("file", postFile);

        const uploadResponse = await axios.post("/api/uploads", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        uniqueFileName = uploadResponse.data.url;
        console.log("Received unique filename:", uniqueFileName);
      }
      const newPost = await submittingPost(
        user._id,
        formattedDesc,
        uniqueFileName,
        dispatch
      );
      // console.log(newPost.data);
      setPostSubmitting(false);
    } catch (error) {
      console.error(
        "An error occurred:",
        error.response?.data || error.message || error
      );
    }
  };

  useEffect(() => {
    if (yourNewPost) {
      setPostFile(null);
      setPreviewImg(null);
    }
  }, [yourNewPost]);

  const handleRemoveImage = () => {
    setPostFile(null);
    setPreviewImg(null);
  };

  useEffect(() => {
    const textarea = document.querySelector("textarea");
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 128) + "px"; // Max 4 rows
  }, [desc]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        return;
      }
      e.preventDefault(); // Prevent new line
      postSubmit();
    }
  };

  return (
        <form
          onSubmit={postSubmit}
          className="bg-white relative mx-2 p-4 shadow-[0px_0px_15px_-10px_rgba(0,0,0,0.6)] border border-gray-200 rounded-lg flex flex-col gap-3 max-w-[540px] w-full"
        >
          <div className="flex items-center gap-3 w-full">
            {/* Profile Photo (Visible on Small Screens and Above) */}
            <div className="w-[50px] h-[50px] sm:flex hidden">
              <CurrentUserPhoto />
            </div>

            {/* Input Field */}
            <div className="flex-1">
              <textarea
                onChange={handlePostDescChange}
                onKeyDown={handleKeyDown}
                value={desc}
                className="w-full py-2 px-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none overflow-hidden"
                placeholder={`What’s on your mind ${user.fullname}?`}
                rows={1}
                style={{ minHeight: "auto", maxHeight: "8rem" }} // Max height for 4 rows
              ></textarea>
            </div>
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
                <label htmlFor="uploadButton" className="flex items-center">
                  <span className="cursor-pointer text-blue-500 text-2xl mr-1">
                    <i className="ri-image-ai-fill"></i>
                  </span>
                  <span className="text-gray-600 cursor-pointer sm:block hidden text-xs sm:text-base">
                    Photo or Video
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-center items-center">
              <li className="cursor-pointer text-red-500 text-2xl mr-1">
                <i className="ri-hashtag"></i>
              </li>
              <span className="text-gray-600 cursor-pointer sm:block hidden text-xs sm:text-base">
                Tag
              </span>
            </div>

            <div className="flex justify-center items-center">
              <li className="cursor-pointer text-yellow-500 text-2xl mr-1">
                <i className="ri-emoji-sticker-line"></i>
              </li>
              <span className="text-gray-600 cursor-pointer sm:block hidden text-xs sm:text-base">
                Feeling
              </span>
            </div>

            <button
              type="submit"
              className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 flex items-center justify-center"
              disabled={postSubmitting} // Disable the button while submitting
            >
              {postSubmitting ? (
                <span className="flex items-center gap-2">
                  {/* Loading spinner */}
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="4" />
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="4"
                      d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z"
                    />
                  </svg>
                  Posting...
                </span>
              ) : (
                "Post"
              )}
            </button>
          </ul>
        </form>
  );
}

export default cPost;

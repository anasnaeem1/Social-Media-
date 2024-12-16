import { useContext, useRef, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../../context/AuthContext";
import CurrentUserPhoto from "../../../../currentUserPhoto";

function cPost({ ShareOptions, SeperatingLine }) {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const PA = import.meta.env.VITE_PUBLIC_API;
  const { user } = useContext(AuthContext);
  const [postFile, setPostFile] = useState(null);
  // const [filename, setFileName] = useState(null);
  const desc = useRef();

  const handlePostFileChange = (e) => {
    const selectedPostPic = e.target.files[0];
    if (selectedPostPic) {
      setPostFile(selectedPostPic);
      console.log("File selected:", selectedPostPic);
    }
  };
  // console.log("Generated filename on the frontend:", filename);

  const postSubmit = async (e) => {
    e.preventDefault();

    if (!postFile) {
      console.error("No file selected.");
      return;
    }
    console.log("File to be uploaded:", postFile); // Debugging: check if file exists

    try {
      const data = new FormData();
      data.append("file", postFile);

      // Upload file and get the unique filename from the backend
      const uploadResponse = await axios.post(
        "http://localhost:8801/api/uploads",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const uniqueFileName = uploadResponse.data;
      console.log("Received unique filename:", uniqueFileName);

      // Prepare the new post object
      const newPost = {
        userId: user._id,
        desc: desc.current.value,
        img: uniqueFileName,
      };

      // Submit the new post
      console.log("Submitting new post...");
      const postResponse = await axios.post(`${PA}/api/posts/`, newPost);
      console.log("Post creation response:", postResponse.data);
    } catch (error) {
      console.error(
        "An error occurred:",
        error.response?.data || error.message || error
      );
    }
  };

  return (
    <form
      onSubmit={postSubmit}
      className="bg-white mx-2 p-5 shadow-[0px_0px_22px_-13px_rgba(0,0,0,0.84)] border border-gray-200 rounded-2xl flex flex-col gap-4 max-w-[540px] w-full"
    >
      {/* <p>hello...</p> */}
      <div className="rounded-2xl flex flex-col justify-center items-start gap-4">
        <div className="flex justify-start items-center gap-3 w-full">
          <div>
            <CurrentUserPhoto />
          </div>
          <div className="flex-1">
            <input
              ref={desc}
              className="py-2 w-full px-2 rounded-md focus:outline-none"
              placeholder={`What’s on your mind ${user.username}?`}
              type="text"
            />
          </div>
        </div>
        <div className="w-full">
          <SeperatingLine color={"border-gray-300"} />
        </div>
      </div>
      <div>
        <ul className="flex justify-around gap-2 w-full">
          {ShareOptions.map((option, id) => {
            const colorClasses = [
              "text-red-600", // Color for id 0
              "text-blue-600", // Color for id 1
              "text-green-600", // Color for id 2
              "text-yellow-600", // Color for id 3
            ];

            return (
              <div
                key={id}
                className={`${
                  option.id === 3 || option.id === 4 ? "hidden sm:flex" : "flex"
                } justify-center items-center gap-1`}
              >
                <li className={`${colorClasses[id]} cursor-pointer text-xl`}>
                  {option.icon}
                </li>
                <span
                  className={`${
                    option.id === 1 ? "hidden" : undefined
                  } cursor-pointer text-sm`}
                >
                  {option.label}
                </span>
                {option.id === 1 && (
                  <div className="flex justify-center items-center">
                    <label
                      htmlFor="uploadButton"
                      className="cursor-pointer text-sm"
                    >
                      Photos and Videos
                    </label>
                    <input
                      encType="multipart/form-datas"
                      onChange={handlePostFileChange}
                      type="file"
                      id="uploadButton"
                      accept=".png,.jpg,.jpeg"
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            );
          })}
          <button
            type="submit"
            className="py-2 px-4 border rounded-xl hover:bg-green-500 transition-all duration-300"
          >
            Post
          </button>
        </ul>
      </div>
    </form>
  );
}

export default cPost;

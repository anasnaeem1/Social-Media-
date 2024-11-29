import { useContext, useRef, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../../context/AuthContext";

function cPost({ ShareOptions, UserPhoto, SeperatingLine, postUser }) {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState(null);
  const desc = useRef();

  // Handle file selection and generate a unique filename
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const uniqueName = `${Date.now()}_${selectedFile.name}`;
      setFile(selectedFile);
      setFilename(uniqueName);
    }
  };

  // console.log("Generated filename on the frontend:", filename);

  const postSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
      img: filename,
    };

    if (file) {
     const data = new FormData();
      data.append("file", file);
      data.append("name", filename);
      console.log("FormData contents:", data);
      for (let [key, value] of data.entries()) {
        console.log(`${key}:`, value); // Should show file and name
      }
      try {
        const uploadResponse = await axios.post(
          "http://localhost:8801/api/uploads",
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        console.log("File upload response:", uploadResponse.data);
      } catch (error) {
        console.error("File upload error:", error.response?.data || error);
        return; // Exit if upload fails
      }
    } else {
      console.error("No file selected or filename missing.");
    }

    console.log("Submitting new post...");
    try {
      const postResponse = await axios.post(
        "http://localhost:8801/api/posts/",
        newPost
      );
      console.log("Post creation response:", postResponse.data);
    } catch (error) {
      console.error("Post creation error:", error.response?.data || error);
    }

  };

  return (
    <form
      onSubmit={postSubmit}
      className="bg-white mx-2 p-5 shadow-[0px_0px_22px_-13px_rgba(0,0,0,0.84)] border border-gray-200 rounded-2xl flex flex-col gap-4 max-w-[540px] w-full"
    >
      <div className="rounded-2xl flex flex-col justify-center items-start gap-4">
        <div className="flex justify-start items-center gap-3 w-full">
          <div>
            <UserPhoto />
          </div>
          <div className="flex-1">
            <input
              ref={desc}
              className="py-2 w-full px-2 rounded-md focus:outline-none"
              placeholder={`What’s on your mind ${user.username} ?`}
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
                      enctype="multipart/form-datas"
                      onChange={handleFileChange}
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

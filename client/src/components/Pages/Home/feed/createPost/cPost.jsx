import { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { useRef } from "react";
import axios from "axios";

function cPost({ ShareOptions, UserPhoto, SeperatingLine }) {
  // const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const { user } = useContext(AuthContext);
  // const desc = useRef(desc);
  // const photoOrVideo = useRef(photoOrVideo)

  //  const postSubmit = async (e) => {
  //   e.preventDefault();
  //   const newPost = {
  //     "userId": user._id,
  //     "desc": desc.current.value,
  //     "img": photoOrVideo.current.value
  //   }
  //   try {
  //     await axios.post("http://localhost:8800/api/posts/", newPost)
  //   } catch (error) {
  //     console.log(error)
  //   }
  //  }

  return (
    <form className="bg-white mx-2 p-5 shadow-[0px_0px_22px_-13px_rgba(0,0,0,0.84)] border border-gray-200 rounded-2xl flex flex-col gap-4 max-w-[540px] w-full">
      <div className="rounded-2xl flex flex-col justify-center items-start gap-4">
        <div className="flex justify-start items-center gap-3 w-full">
          <div>
            <UserPhoto />
          </div>

          <div className="flex-1">
            <input
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
                      type="file"
                      id="uploadButton"
                      accept=".png,.jpg,.jpeg"
                      className="hidden" // Hides the default file input
                    />
                  </div>
                )}{" "}
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

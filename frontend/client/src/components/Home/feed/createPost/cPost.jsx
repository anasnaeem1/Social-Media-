import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { submittingPost } from "../../../../apiCalls";
import { UserContext } from "../../../context/UserContext";
import CurrentUserPhoto from "../../../currentUserPhoto";

function cPost({ ShareOptions, cPostFile, userId, SeperatingLine }) {
  const { user, dispatch, yourNewPost } = useContext(UserContext);
  const [postFile, setPostFile] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [postSubmitting, setPostSubmitting] = useState(null);
  const [desc, setDesc] = useState("");
  const postDescRef = useRef(null);

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
      setDesc("");
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
      }
      await submittingPost(user._id, formattedDesc, uniqueFileName, dispatch);
      setPostSubmitting(false);
    } catch (error) {
      console.error(
        "An error occurred:",
        error.response?.data || error.message || error
      );
      setPostSubmitting(false);
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
    const textarea = postDescRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 128) + "px";
  }, [desc]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        return;
      }
      e.preventDefault();
      postSubmit(e);
    }
  };

  return (
    <form
      onSubmit={postSubmit}
      className="relative mx-2 w-full max-w-[540px] overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.06)]"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />

      <div className="flex flex-col gap-4 p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="hidden h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-md sm:block sm:h-12 sm:w-12">
            <CurrentUserPhoto />
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400 sm:text-[11px]">
              New post
            </p>
            <textarea
              ref={postDescRef}
              onChange={handlePostDescChange}
              onKeyDown={handleKeyDown}
              value={desc}
              rows={1}
              className="w-full resize-none overflow-hidden rounded-xl border border-gray-200 bg-gray-50/90 px-3.5 py-3 text-[15px] leading-relaxed text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:px-4 sm:py-3.5"
              placeholder={`What’s on your mind, ${user?.fullname || "there"}?`}
              style={{ minHeight: "48px", maxHeight: "8rem" }}
            />
          </div>
        </div>

        {previewImg && postFile && (
          <div className="relative overflow-hidden rounded-xl border border-gray-300 bg-gray-100">
            <div
              className="aspect-[16/10] w-full bg-cover bg-center bg-no-repeat sm:aspect-video"
              style={{ backgroundImage: `url(${previewImg})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute right-2 top-2 flex gap-2 sm:right-3 sm:top-3">
              <label
                htmlFor="uploadButtonForPostFile"
                className="cursor-pointer rounded-lg bg-white/95 px-3 py-1.5 text-xs font-medium text-gray-800 shadow-sm backdrop-blur transition hover:bg-white sm:text-sm"
              >
                Change
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
                className="rounded-lg bg-red-500/95 px-3 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur transition hover:bg-red-600 sm:text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        <div className="hidden sm:block">
          <SeperatingLine color={"border-gray-100"} />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <input
              onChange={handlePostFileChange}
              type="file"
              id="uploadButton"
              accept=".png,.jpg,.jpeg"
              className="hidden"
            />
            <label
              htmlFor="uploadButton"
              className="inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-sm text-gray-600 transition hover:bg-indigo-50 hover:text-indigo-700"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-lg text-indigo-600">
                <i className="ri-image-2-line" />
              </span>
              <span className="hidden font-medium sm:inline">Photo</span>
            </label>

            <button
              type="button"
              className="inline-flex cursor-default items-center gap-2 rounded-full px-3 py-2 text-sm text-gray-500 opacity-70"
              disabled
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-lg text-gray-500">
                <i className="ri-hashtag" />
              </span>
              <span className="hidden font-medium sm:inline">Tag</span>
            </button>

            <button
              type="button"
              className="inline-flex cursor-default items-center gap-2 rounded-full px-3 py-2 text-sm text-gray-500 opacity-70"
              disabled
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-lg text-amber-600">
                <i className="ri-emotion-happy-line" />
              </span>
              <span className="hidden font-medium sm:inline">Feeling</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={postSubmitting || (!desc.trim() && !postFile)}
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[120px] sm:py-2.5"
          >
            {postSubmitting ? (
              <>
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Posting…
              </>
            ) : (
              "Post"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

export default cPost;

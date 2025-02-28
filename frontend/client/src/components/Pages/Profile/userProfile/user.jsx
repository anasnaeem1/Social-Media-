import Feed from "../../Home/feed/feed";
import UserInfo from "./userInfo";
import ProfilePicSkeleton from "../../../Skeleton/profileSkeleton/profilePicSkeleton";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function User({
  profileLoading,
  userId,
  profileUser,
  UserPhoto,
  mainItems,
  SeperatingLine,
}) {
  const { dispatch, user: currentUser } = useContext(UserContext);
  const PA = import.meta.env.VITE_PUBLIC_API;
  // const PF = import.meta.env.VITE_PUBLIC_FOLDER || "/images/";
  const { Friends } = mainItems;
  const [followed, setFollowed] = useState(false);
  const [editVisibility, setEditVisibility] = useState(false);
  const [convo, setConvo] = useState(null);
  // const [newConvo, setNewConvo] = useState(null);
  const [followLoading, setFollowLoading] = useState(false);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [updateBoxVisibility, setUpdateBoxVisibility] = useState(false);
  const [updatingProfilePic, setUpdatingProfilePic] = useState(false);
  const [cPostFile, setCPostFile] = useState(true);
  const navigate = useNavigate();

  // Check currentUser follows this ProfileUser
  useEffect(() => {
    if (profileUser._id) {
      const normalizedFollowings = currentUser.followings.map((id) =>
        id.toString()
      );
      const isFollowed = normalizedFollowings.includes(
        profileUser._id.toString()
      );
      setFollowed(isFollowed);
      // console.log("Includes:", isFollowed);
    }
  }, [currentUser.followings, profileUser._id]);

  //Handle stop navigating while followLoading
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (followLoading) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [followLoading]);

  // Fetching Convo
  useEffect(() => {
    if (profileUser._id) {
      const fetchConvo = async () => {
        try {
          const res = await axios.get(
            `/api/convos/${profileUser._id}/${currentUser._id}`
          );
          // console.log(res.data);
          if (res.data) {
            setConvo(res.data);
          }
          // if(res.data) => {}
          // setFriendList(res.data);
          // setIsLoading(false);
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
      };
      fetchConvo();
    }
  }, [profileUser]);

  // Handle Follow
  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      if (followed) {
        const res = await axios.put(`/api/users/${profileUser._id}/unfollow`, {
          userId: currentUser._id,
        });
        // console.log(res.data);
        if (res.data) {
          dispatch({ type: "UNFOLLOW", payload: profileUser._id });
        }
      } else {
        const res = await axios.put(`/api/users/${profileUser._id}/follow`, {
          userId: currentUser._id,
        });
        if (res.data) {
          dispatch({ type: "FOLLOW", payload: profileUser._id });
        }
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleProfilePicChange = (e) => {
    const selectedPic = e.target.files[0];

    if (!selectedPic) return;
    setProfilePicFile(selectedPic);
    // setUpdateBoxVisibility(!selectedPic);
    dispatch({ type: "SHOW_UPLOADPROFILEBOX" });
  };

  useEffect(() => {
    setCPostFile(!profilePicFile); // true if profilePicFile is null, false otherwise
  }, [profilePicFile]);

  // Adding profilePicture And Deleting Previous Ones
  const handleProfilePictureUpdate = async (e) => {
    e.preventDefault();

    if (!profilePicFile) {
      console.error("No file selected.");
      return;
    }

    try {
      setUpdatingProfilePic(true);
      if (currentUser.profilePic) {
        const deletingOldFile = await axios.delete(`/api/delete`, {
          data: { url: currentUser.profilePic },
        });
      }

      const data = new FormData();
      data.append("file", profilePicFile);

      const uploadResponse = await axios.post(`/api/uploads`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uniqueFileName = uploadResponse.data.url;

      // Step 3: Update user profile with new profile picture
      const newProfilePic = {
        userId: currentUser._id,
        profilePic: uniqueFileName,
      };

      const profilePicResponse = await axios.put(
        `/api/users/${currentUser._id}`,
        newProfilePic
      );
      if (profilePicResponse.data) {
        console.log(profilePicResponse.data);

        dispatch({
          type: "UPDATEPROFILEPIC",
          payload: profilePicResponse.data.profilePic,
        });
      }

      setProfilePicFile(null);
      const fileInput = document.getElementById("uploadButton");
      if (fileInput) {
        fileInput.value = "";
      }
      setUpdatingProfilePic(false);
    } catch (error) {
      console.error(
        "An error occurred during profile picture update:",
        error.response?.data || error.message || error
      );
    }
  };

  // Closing File And close uploading process
  const handleCloseFile = () => {
    setProfilePicFile(null);
    setUpdateBoxVisibility(false);
    const fileInput = document.getElementById("uploadButton");
    if (fileInput) {
      fileInput.value = "";
      dispatch({ type: "HIDE_UPLOADPROFILEBOX" });
    }
  };

  // Handling Edit button Visibility
  const handleEditVisiblity = (e) => {
    e.preventDefault();
    setEditVisibility((prev) => !prev);
  };

  // Handle Message
  const handleConvo = async (e) => {
    e.preventDefault();
    const data = {
      senderId: profileUser._id,
      recieverId: currentUser._id,
    };
    try {
      const makingConvo = await axios.post(`/api/convos`, data);

      if (makingConvo.data.convoId) {
        navigate(`/messages/${makingConvo.data.convoId}`);
      } else {
        navigate(`/messages/${convo._id}`);
      }

      if (makingConvo.data && makingConvo.data._id) {
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex flex-col flex-[7]">
        {profileLoading ? (
          <ProfilePicSkeleton />
        ) : (
          <div className="relative flex flex-col gap-0">
            {/* Cover Photo Section */}
            <img
              src={
                profileUser.coverPic
                  ? profileUser.coverPic
                  : "/images/noCover.jpg"
              }
              alt="Cover"
              className="h-[200px] md:h-[300px] rounded-t-md mx-auto max-w-7xl w-full shadow-md object-cover"
            />
            {/* Profile and Info Section */}
            <div className="absolute top-[120px] md:top-[270px] md:left-[20px] left-1/2 transform userDetailsBox -translate-x-1/2 md:-translate-x-0 max-w-7xl mx-auto  rounded-md  w-full">
              <div className="flex flex-col items-center md:flex-row md:items-center gap-2">
                {/* Profile Picture */}
                <div className="relative">
                  {/* Profile Picture or Skeleton Loader */}
                  {
                    <img
                      src={
                        profileUser.profilePic
                          ? profileUser.profilePic.replace(
                              "/upload/",
                              "/upload/f_auto,q_auto/"
                            )
                          : "https://res.cloudinary.com/datcr1zua/image/upload/v1739709690/uploads/rindbm34tibrtqcgvpsd.png"
                      }
                      alt="Profile"
                      className={`${
                        userId === currentUser._id
                          ? "border-[3px] border-white"
                          : ""
                      }${
                        !profileUser.profilePic && "border-none"
                      } border-[2px] border-white h-[140px] w-[140px] md:h-[156px] md:w-[156px] sm:h-[156px] sm:w-[156px] rounded-full shadow-lg mx-auto md:mx-0 object-cover`}
                    />
                  }

                  {/* Circular Progress Bar (for non-current user) */}
                  {userId !== currentUser._id && (
                    <svg
                      className="absolute top-0 left-0 h-[162px] w-[162px] transform -translate-y-[5px] -translate-x-[5px] rotate-[90deg]"
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.1"
                      viewBox="0 0 160 160"
                    >
                      <defs>
                        <linearGradient id="GradientColor">
                          <stop offset="0%" stopColor="#0079ff" />
                          <stop offset="100%" stopColor="#0086ff" />
                        </linearGradient>
                      </defs>
                      <circle
                        className={`fill-none stroke-[4px] ${
                          followed ? "loading-start" : "loading-end"
                        }`}
                        cx="80"
                        cy="80"
                        r="75"
                        strokeLinecap="round"
                        stroke="url(#GradientColor)"
                        strokeDasharray="472"
                        strokeDashoffset="472"
                      />
                    </svg>
                  )}

                  {/* Follow Button or Edit Options */}
                  {userId !== currentUser._id ? (
                    <div
                      onClick={handleFollow}
                      className={`${
                        followed
                          ? "bg-gray-100 hover:bg-gray-200"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      } absolute left-1/2 bottom-[-15px] transform -translate-x-1/2 cursor-pointer w-10 h-10 rounded-full flex justify-center items-center shadow-lg transition`}
                    >
                      {followed ? (
                        <i className="ri-user-minus-line"></i>
                      ) : (
                        <i className="ri-user-received-2-line"></i>
                      )}
                    </div>
                  ) : editVisibility ? (
                    <>
                      <input
                        enctype="multipart/form-data"
                        onChange={handleProfilePicChange}
                        type="file"
                        id="uploadProfilePicBtn"
                        accept=".png,.jpg,.jpeg"
                        className="hidden"
                      />
                      {/* Label wrapping everything to trigger file input */}
                      <label
                        htmlFor="uploadProfilePicBtn"
                        className="absolute left-1/2 bottom-[-20px] transform -translate-x-1/2 cursor-pointer py-2 bg-white rounded-full flex items-center justify-between hover:bg-blue-100 px-4 shadow-lg border border-gray-200 hover:text-blue-600 transition"
                      >
                        <i className="text-lg ri-image-edit-line text-gray-500"></i>
                        <span className="text-sm font-medium text-gray-600">
                          Update
                        </span>
                      </label>
                    </>
                  ) : (
                    ""
                  )}
                </div>

                {/* User Info */}
                <div className="text-center transform md:translate-x-2 md:translate-y-[25px] md:text-left">
                  <h1 className="text-xl font-semibold md:text-2xl">
                    {profileUser.fullname}
                  </h1>
                  <p className="text-sm text-gray-600 md:text-base">
                    {profileUser.bio}
                  </p>
                  {/* Action Buttons */}
                  <div className="mt-4 flex flex-wrap gap-4 justify-center md:justify-start">
                    {userId !== currentUser._id ? (
                      <button
                        onClick={handleConvo}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
                      >
                        Message
                      </button>
                    ) : (
                      <button
                        onClick={handleEditVisiblity}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                      >
                        Edit Profile
                      </button>
                    )}
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition">
                      {`${profileUser?.followers.length} 
          ${profileUser.followers.length === 1 ? "follower" : "Followers"}`}
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition">
                      {`${profileUser?.followings.length} 
          ${profileUser.followings.length === 1 ? "following" : "followings"}`}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className=" h-[235px] md:h-[200px]"></div>
          </div>
        )}

        {/* Feed and User Info */}
        <div
          className={`flex ${
            userId ? "" : ""
          } flex-col-reverse lg:flex-row mx-auto justify-center gap-6 px-6 max-w-7xl`}
        >
          <div className="flex-grow">
            <Feed
              cPostFile={cPostFile}
              userId={userId}
              UserPhoto={UserPhoto}
              mainItems={mainItems}
              SeperatingLine={SeperatingLine}
            />
          </div>
          <UserInfo
            userId={userId}
            Friends={Friends}
            profileUser={profileUser}
          />
        </div>
      </div>

      {profilePicFile && (
        <div className="relative z-50">
          {/* Black Overlay */}
          <div className="fixed inset-0 bg-black opacity-50"></div>

          {/* Update Box */}
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="w-[400px] max-w-full border flex flex-col items-center bg-white shadow-lg p-6 rounded-lg relative z-50">
              {/* Close Icon */}
              <div className="absolute top-2 right-2">
                <i
                  className="ri-close-line text-2xl text-gray-600 cursor-pointer"
                  onClick={handleCloseFile} // Close functionality
                ></i>
              </div>

              {/* Image Preview */}
              <div className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-full overflow-hidden mb-5 shadow-md">
                <img
                  src={URL.createObjectURL(profilePicFile)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Information Text */}
              <p className="text-sm text-gray-600 mb-3">
                Click here to change photo
              </p>

              {/* Button Container (Side by Side) */}
              <div className="flex space-x-4 mb-4 w-full justify-center">
                {/* Change File Button */}
                <label
                  htmlFor="uploadButton"
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer w-1/2 text-center"
                >
                  Change File
                </label>

                <input
                  enctype="multipart/form-data"
                  onChange={handleProfilePicChange}
                  type="file"
                  id="uploadButton"
                  accept=".png,.jpg,.jpeg"
                  className="hidden text-xl"
                />

                {/* Upload Button */}
                <button
                  type="submit"
                  className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 flex items-center justify-center"
                  onClick={handleProfilePictureUpdate}
                  disabled={updatingProfilePic}
                >
                  {updatingProfilePic ? (
                    <span className="flex items-center gap-2">
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
                      Uplaoding...
                    </span>
                  ) : (
                    "Upload"
                  )}
                </button>
              </div>

              <hr className="my-4 w-full border-gray-300" />

              {/* Optional: Info about file */}
              <p className="text-xs text-gray-500">
                JPEG, PNG, or GIF files are supported. Max size: 4MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
    </>
  );
}

export default User;

import Feed from "../../Home/feed/feed";
// import noAvatar from "../../../../assets/noAvatar.jpg";
// import noCover from "../../../../assets/noCover.jpg";
import UserInfo from "./userInfo";
import ProfilePicSkeleton from "../../../Skeleton/profileSkeleton/profilePicSkeleton";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import CurrentUser from "../../../currentUserPhoto";

function User({
  profileLoading,
  userId,
  profileUser,
  UserPhoto,
  mainItems,
  SeperatingLine,
}) {
  const { dispatch, user: currentUser } = useContext(AuthContext);
  const PA = import.meta.env.VITE_PUBLIC_API;
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const { Friends } = mainItems;
  const [followed, setFollowed] = useState(false);
  const [editVisibility, setEditVisibility] = useState(false);
  const [convo, setConvo] = useState(null);
  const [newConvo, setNewConvo] = useState(null);
  const [followLoading, setFollowLoading] = useState(false);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [updateBoxVisibility, setUpdateBoxVisibility] = useState(false);
  const navigate = useNavigate();

  //Check currentUser follows this ProfileUser
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
            `${PA}/api/convos/${profileUser._id}/${currentUser._id}`
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
        const res = await axios.put(
          `${PA}/api/users/${profileUser._id}/unfollow`,
          {
            userId: currentUser._id,
          }
        );
        // console.log(res.data);
        if (res.data) {
          dispatch({ type: "UNFOLLOW", payload: profileUser._id });
        }
      } else {
        const res = await axios.put(
          `${PA}/api/users/${profileUser._id}/follow`,
          {
            userId: currentUser._id,
          }
        );
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

  // Handle profile Change 
  const handleProfilePicChange = (e) => {
    const selectedPic = e.target.files[0];
    if (selectedPic) {
      setProfilePicFile(selectedPic);
      setUpdateBoxVisibility(true)
      dispatch({ type: "SHOW_OVERLAY" });
    }
  };

  useEffect(()=>{
    if(updateBoxVisibility){
      // console.log(updateBoxVisibility)
    }
  })

  // Adding profilePicture And Deleting Previous Ones
  const handleProfilePictureUpdate = async (e) => {
    e.preventDefault();

    if (!profilePicFile) {
      console.error("No file selected.");
      return;
    }

    try {
      const data = new FormData();
      data.append("file", profilePicFile);

      // Upload the file
      const uploadResponse = await axios.post(`${PA}/api/uploads`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uniqueFileName = uploadResponse.data;
      // console.log("Received unique filename:", uniqueFileName);

      const newProfilePic = {
        userId: currentUser._id,
        profilePic: uniqueFileName,
      };

      // Submit the profile picture update request
      const profilePicResponse = await axios.put(
        `${PA}/api/users/${currentUser._id}`,
        newProfilePic
      );

      dispatch({
        type: "UPDATEPROFILEPIC",
        payload: profilePicResponse.data.profilePic,
      });

      setProfilePicFile(null);
      const fileInput = document.getElementById("uploadButton");
      if (fileInput) {
        fileInput.value = "";
      }

      if (uploadResponse.data) {
        if (currentUser.profilePic) {
          try {
            await axios.delete(`${PA}/api/delete/${currentUser.profilePic}`);
            const newPost = {
              userId: currentUser._id,
              isProfileUpdate: true,
              img: profilePicResponse.data.profilePic,
            };

            // console.log("Submitting new post...");
            const postResponse = await axios.post(
              "http://localhost:8801/api/posts/",
              newPost
            );
            // console.log(postResponse.data)
          } catch (error) {
            console.error(error);
          }
        }
      }
    } catch (error) {
      console.error(
        "An error occurred during profile picture update:",
        error.response?.data || error.message || error
      );
    }
  };

  // Closing File And close uploading process 
  const handleCloseFile = (e) => {
    setProfilePicFile(null); // Reset the file state to null
    setUpdateBoxVisibility(false)
    const fileInput = document.getElementById("uploadButton");
    if (fileInput) {
      fileInput.value = ""; // Reset the file input field value
      dispatch({ type: "HIDE_OVERLAY" });
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
      const makingConvo = await axios.post(`${PA}/api/convos`, data);
      
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
      <div className="flex-[7]">
        {profileLoading ? (
          <ProfilePicSkeleton />
        ) : (
          <div className="relative z-2">
            {/* Cover Photo Section */}
            <div
              className="h-[200px] md:h-[300px] rounded-t-md mx-auto max-w-7xl w-full shadow-md"
              style={{
                backgroundImage: `url(${
                  profileUser.coverPic
                    ? PF + "/" + profileUser.coverPic
                    : PF + "/noCover.jpg"
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>

            {/* Profile and Info Section */}
            <div className="relative -top-[50px] max-w-7xl mx-auto  rounded-md shadow-md p-6">
              <div className="flex flex-col items-center md:flex-row md:items-center gap-6">
                {/* Profile Picture */}
                <div
                  className={`${
                    userId === currentUser._id
                      ? "border-[3px] border-white"
                      : ""
                  } relative h-[170px] w-[170px] md:h-[150px] md:w-[150px] rounded-full shadow-lg mx-auto md:mx-0`}
                  style={{
                    backgroundImage: `url(${
                      profileUser.profilePic
                        ? `${PF}/${profileUser.profilePic}`
                        : `${PF}/noAvatar.png`
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {userId !== currentUser._id && (
                    <svg
                      className="absolute top-0 left-0 h-[156px] w-[156px] transform -translate-y-[3px] -translate-x-[3px] rotate-[90deg]"
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
                        }
                      `}
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

                  {userId !== currentUser._id ? (
                    <div
                      onClick={handleFollow}
                      className={`${
                        followed
                          ? "bg-gray-100 hover:bg-gray-200"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      } absolute left-1/2 bottom-[-15px] transform -translate-x-1/2 cursor-pointer w-10 h-10 rounded-full flex justify-center items-center shadow-lg  transition`}
                    >
                      {followed ? (
                        <i className="ri-user-minus-line"></i>
                      ) : (
                        <i className="ri-user-received-2-line"></i>
                      )}
                    </div>
                  ) : editVisibility ? (
                    <div className="absolute left-1/2 bottom-[-20px] transform -translate-x-1/2 cursor-pointer w-[140px] h-12 bg-white rounded-full flex items-center justify-between px-4 shadow-lg border border-gray-200">
                      {/* Hidden File Input */}
                      <input
                        enctype="multipart/form-data"
                        onChange={handleProfilePicChange}
                        type="file"
                        id="uploadProfilePicBtn"
                        accept=".png,.jpg,.jpeg"
                        className="hidden"
                      />

                      {/* Profile Picture Update */}
                      <label
                        htmlFor="uploadButton"
                        className="flex items-center gap-2 hover:text-blue-600 transition cursor-pointer"
                      >
                        <i className="text-lg ri-image-edit-line text-gray-500"></i>
                        <button className="text-sm font-medium text-gray-600">
                          Update
                        </button>
                      </label>

                      {/* More Options (Three Dots) */}
                      <div
                        // onClick={handleMoreOptions}
                        className="p-2 rounded-full hover:bg-gray-100 transition flex justify-center items-center"
                      >
                        <i className="text-lg ri-more-2-line text-gray-500"></i>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                {/* User Info */}
                <div className="text-center tranform translate-y-[20px] md:text-left">
                  <h1 className="text-xl font-semibold md:text-2xl">
                    {profileUser.username}
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
                      ${
                        profileUser.followers.length === 1
                          ? "follower"
                          : "Followers"
                      }
                      `}
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition">
                      {`${profileUser?.followings.length} 
                      ${
                        profileUser.followings.length === 1
                          ? "following"
                          : "followings"
                      }
                      `}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feed and User Info */}
        <div className="flex flex-col-reverse lg:flex-row mx-auto justify-center gap-6 px-6 max-w-7xl">
          <div className="flex-grow">
            <Feed
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

                {/* Upload Button */}
                <button
                  onClick={handleProfilePictureUpdate}
                  className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition w-1/2 text-center"
                >
                  Upload
                </button>
              </div>

              <hr className="my-4 w-full border-gray-300" />

              {/* Optional: Info about file */}
              <p className="text-xs text-gray-500">
                JPEG, PNG, or GIF files are supported. Max size: 5MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        enctype="multipart/form-data"
        onChange={handleProfilePicChange}
        type="file"
        id="uploadButton"
        accept=".png,.jpg,.jpeg"
        className="hidden"
      />
    </>
  );
}

export default User;

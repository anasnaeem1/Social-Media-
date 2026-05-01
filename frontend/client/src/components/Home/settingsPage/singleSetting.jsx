import axios from "axios";
import { useEffect, useState, useContext, useRef } from "react";
import { UserContext } from "../../../context/UserContext";
import { useLocation } from "react-router-dom";

function singleSetting({ SingleSetting }) {
  const location = useLocation();
  const { user: currentUser } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaveChangesButtonVisible, setIsSaveChangesButtonVisible] =
    useState(false);
  const isFriendsListPage = location.pathname.startsWith("/friends/list");
  const isFriendsRequestPage =
    location.pathname.startsWith("/friends/requests");

  const handleEditButton = () => {
    const willEnterEditMode = !isEditing;
    setIsEditing(willEnterEditMode);

    if (willEnterEditMode) {
      setTimeout(() => {
        newUserName.current.focus();
      }, 0);
    }
  };


  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        {/* Info Key */}
        <span className="text-md font-medium text-gray-700">
          {SingleSetting.key}
        </span>

        {/* Info Value and Edit Button */}
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <div className="bg-gray-100 border border-gray-200 rounded-md px-4 py-2 min-w-[220px]">
              <h3 className="text-md text-gray-700">{SingleSetting.label}</h3>
            </div>
          ) : (
            <div className="bg-white border border-gray-300 rounded-md px-4 py-2 min-w-[220px] transition-all focus-within:border-blue-500">
              <input
                ref={newUserName}
                type="text"
                placeholder={SingleSetting.label}
                className="w-full bg-transparent outline-none text-md text-gray-700 placeholder-gray-400"
              />
            </div>
          )}

          {/* Edit Button */}
          <button
            className="p-2 border border-gray-200 rounded-md hover:bg-gray-100 transition-all"
            onClick={handleEditButton}
          >
            <i className="ri-edit-box-line text-lg text-gray-600"></i>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-b border-gray-200"></div>
    </div>
  );
}
export default singleSetting;

import axios from "axios";
import { useEffect, useState, useContext, useRef } from "react";
import { UserContext } from "../../../context/UserContext";
import { useLocation } from "react-router-dom";
import { updateUser } from "../../../../apiCalls";
import * as React from "react";
import {
  LocalizationProvider,
  MobileDatePicker,
  DesktopDatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

function settingsPage() {
  const location = useLocation();
  const { dispatch, user: currentUser } = useContext(UserContext);
  const [userInfo, setUserInfo] = useState([
    {
      key: "Fullname",
      label: currentUser.fullname,
      id: "fullname1",
      icon: <i className="text-xl ri-group-fill text-gray-700"></i>,
      path: "/fullname",
      isEditing: false,
    },
    {
      key: "DOB",
      label: currentUser.DOB,
      id: "dob1",
      icon: <i className="text-xl ri-group-fill text-gray-700"></i>,
      path: "/dob",
      isEditing: false,
    },
    {
      key: "City",
      label: currentUser.city,
      id: "city1",
      icon: <i className="text-xl ri-group-fill text-gray-700"></i>,
      path: "/city",
      isEditing: false,
    },
    {
      key: "From",
      label: currentUser.from,
      id: "from1",
      icon: <i className="text-xl ri-group-fill text-gray-700"></i>,
      path: "/from",
      isEditing: false,
    },
  ]);
  const [dobForDayjs, setDobForDayjs] = useState(dayjs());
  const [isSaveChangesNeeded, setIsSaveChangesNeeded] = useState(false);
  const [changesLoading, setChangesLoading] = useState(false);
  const [newChangesDone, setnewChangesDone] = useState(false);
  const [newFullname, setNewFullname] = useState(null);
  const [newDob, setNewDob] = useState(null);
  const [newCity, setNewCity] = useState(null);
  const [newFrom, setNewFrom] = useState(null);
  const isFriendsListPage = location.pathname.startsWith("/friends/list");
  const isFriendsRequestPage =
    location.pathname.startsWith("/friends/requests");
  const inputRefs = useRef([]);

  const handleEditButton = (id) => {
    setUserInfo((prevUserInfo) =>
      prevUserInfo.map((info) =>
        info.id === id
          ? { ...info, isEditing: !info.isEditing } // Toggle isEditing for the specific item
          : info
      )
    );

    // Focus the input field after toggling edit mode
    setTimeout(() => {
      const index = userInfo.findIndex((info) => info.id === id);
      if (inputRefs.current[index]) {
        inputRefs.current[index].focus();
      }
    }, 0);
  };

  const handleInputChange = (e, key) => {
    const value = e.target.value;
    // console.log({ [key]: value });

    switch (key) {
      case "Fullname":
        setNewFullname(value);
        break;
      case "City":
        setNewCity(value);
        break;
      case "From":
        setNewFrom(value);
        break;
      default:
        console.warn(`Unhandled key: ${key}`);
    }
  };

  const handleDateChange = (newValue) => {
    if (!newValue) return; // Prevent null values
    setDobForDayjs(newValue); // Store as Day.js object
    setNewDob(newValue.format("DD-MM-YYYY")); // Store formatted string if needed
  };

  useEffect(() => {
    const isAnyInfoIsInEditingProcess = userInfo.filter(
      (info) => info.isEditing
    );
    if (isAnyInfoIsInEditingProcess?.length > 0) {
      setIsSaveChangesNeeded(true);
    } else {
      setIsSaveChangesNeeded(false);
    }
  }, [userInfo]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      // Remove undefined values
      const newUpdatingProfile = {
        userId: currentUser._id,
        ...(newFullname && { fullname: newFullname }),
        ...(newDob && { DOB: newDob }),
        ...(newCity && { city: newCity }),
        ...(newFrom && { from: newFrom }),
      };

      // If no changes exist, don't send request
      if (Object.keys(newUpdatingProfile).length === 1) {
        console.log("No changes to update");
        return;
      }

      setChangesLoading(true);
      const UpdatingProfileRes = await axios.put(
        `/api/users/${currentUser._id}`,
        newUpdatingProfile
      );

      const updatingUser = await updateUser(
        UpdatingProfileRes.data,
        currentUser,
        dispatch
      );
      setIsSaveChangesNeeded(false);
      setUserInfo((prevUserInfo) =>
        prevUserInfo.map((item) => ({ ...item, isEditing: false }))
      );
      setChangesLoading(false);
    } catch (error) {
      console.error(error);
      setChangesLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1200px] bg-gray-50 flex flex-col items-center md:px-6 px-0 py-6">
      {/* Page Title */}
      <div className="w-full flex justify-center md:justify-center pb-4">
        <h1 className="font-semibold pl-2 text-gray-900 text-3xl">Settings</h1>
      </div>

      {/* User Info Section */}
      <div className="bg-white w-full md:p-6 p-3 border rounded-xl shadow-sm">
        {/* Section Title */}
        <h2 className="font-semibold text-xl text-gray-800 mb-5 border-b pb-2">
          User Info
        </h2>

        {/* User Info List */}
        <div className="space-y-5">
          {userInfo.map((info) => (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                {/* Info Key */}
                <span className="text-md pr-2 font-medium text-gray-700">
                  {info.key}
                </span>

                {/* Info Value and Edit Button */}
                <div className="flex items-center gap-2">
                  {!info.isEditing ? (
                    <div className="bg-gray-100 border border-gray-200 rounded-md px-4 py-2 w-full max-w-[220px]">
                      <h3
                        className={`${
                          info.key === "DOB" && "py-2"
                        } text-md text-gray-700`}
                      >
                        {info.key === "DOB"
                          ? currentUser?.DOB
                          : info.key === "Fullname"
                          ? currentUser?.fullname
                          : info.key === "City"
                          ? currentUser?.city
                          : info.key === "From"
                          ? currentUser?.from
                          : "Undefined value"}
                      </h3>
                    </div>
                  ) : info.key === "DOB" ? (
                    <div className="w-full">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div className="hidden md:block">
                          <DesktopDatePicker
                            label="Date of Birth"
                            value={dobForDayjs}
                            onChange={handleDateChange}
                            inputFormat="M/D/YYYY"
                            renderInput={(params) => <input {...params} />}
                          />
                        </div>

                        <div className="block md:hidden">
                          <MobileDatePicker
                            label="Date of Birth"
                            value={dobForDayjs}
                            onChange={handleDateChange}
                            inputFormat="M/D/YYYY"
                            renderInput={(params) => <input {...params} />}
                          />
                        </div>
                      </LocalizationProvider>
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-300 rounded-md px-4 py-2 w-full max-w-[220px] transition-all focus-within:border-blue-500">
                      <input
                        onChange={(e) => handleInputChange(e, info.key)}
                        type="text"
                        placeholder={info.label}
                        className="w-full bg-transparent outline-none text-md text-gray-700 placeholder-gray-400"
                      />
                    </div>
                  )}

                  {/* Edit Button */}
                  <button
                    className={`${
                      info.key === "DOB" && "py-3"
                    } p-2 border border-gray-200 rounded-md hover:bg-gray-100 transition-all`}
                    onClick={() => handleEditButton(info.id)}
                  >
                    <i className="ri-edit-box-line text-lg text-gray-600"></i>
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="border-b border-gray-200"></div>
            </div>
          ))}
        </div>

        {/* Save/Cancel Buttons */}
        {isSaveChangesNeeded && (
          <div className="flex justify-end gap-3 mt-8">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all"
              onClick={() => console.log("Cancel Changes")}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              className={`flex items-center justify-center gap-2 text-sm px-4 py-2 rounded-md w-full sm:w-auto bg-blue-500 text-white hover:bg-blue-600  transition-all duration-200`}
              disabled={changesLoading} // Disable button during loading
            >
              {/* Loading Spinner */}
              {changesLoading && (
                <div
                  className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin border-white`}
                ></div>
              )}
              Save changes
            </button>
          </div>
        )}
      </div>
      <div className="w-full h-screen"></div>
    </div>
  );
}
export default settingsPage;

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import { calculateAge, getAllUsers } from "../../../../../apiCalls";
import UserPhoto from "../../../../userPhoto";
import { Link } from "react-router-dom";
import BirthdayUserSkeleton from "./birthdayUserSkeleton";

function UsersBirthdaysPage({ friend }) {
  const { user: currentUser, dispatch } = useContext(UserContext);
  const [timeLeft, setTimeLeft] = useState("");
  const [age, setAge] = useState(null);
  // const { age, formattedBirthday } = getAgeAndFormattedBirthday(friend.DOB);

  useEffect(() => {
    if (friend?.DOB) {
      const age = calculateAge(friend.DOB);
      setAge(age);
    }
    console.log(age);
  }, [friend?.DOB]);

  function moveDateOneDayLater(dateString) {
    // Check if dateString is defined and is a string
    if (!dateString || typeof dateString !== "string") {
      throw new Error("Invalid dateString provided");
    }

    // Split the dateString into day and month
    const [day, month] = dateString.split("/").map(Number);

    // Validate day and month
    if (
      isNaN(day) ||
      isNaN(month) ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31
    ) {
      throw new Error("Invalid date format or values");
    }

    // Get the current year
    const currentYear = new Date().getFullYear();

    // Create a Date object
    const date = new Date(currentYear, month - 1, day);

    // Move the date one day later
    date.setDate(date.getDate() + 1);

    // Extract the new day and month
    const newMonth = date.getMonth() + 1; // Months are 0-indexed in JavaScript
    const newDay = date.getDate();

    // Return the new date in "day/month" format
    return `${newDay}/${newMonth}`;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const now = Date.now();

        if (!friend?.DOB || typeof friend.DOB !== "string") {
          throw new Error("Invalid or missing friend.DOB");
        }

        const OneDayAfterBirthday = moveDateOneDayLater(friend.DOB);

        const currentYear = new Date().getFullYear();

        const [day, month] = OneDayAfterBirthday.split("/").map(Number);

        let targetTime = new Date(currentYear, month - 1, day).getTime();

        if (targetTime <= now) {
          targetTime = new Date(currentYear + 1, month - 1, day).getTime();
        }

        const timeDifference = targetTime - now;

        if (timeDifference <= 0) {
          setTimeLeft("The target time has already passed.");
          clearInterval(interval);
          return;
        }

        // Convert the difference to hours, minutes, and seconds
        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor(
          (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
        );
        // const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000

        let formattedTimeLeft = "";
        if (hours > 0) {
          formattedTimeLeft += `${hours} hour${hours > 1 ? "s" : ""} `;
        }
        setTimeLeft(formattedTimeLeft.trim() || "Less than a second left");
      } catch (error) {
        console.error("Error calculating time left:", error);
        setTimeLeft("Invalid date provided");
        clearInterval(interval);
      }
    }, 1000);
  }, [friend?.DOB]);

  return (
    <div className="w-full p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
  <div className="flex items-center justify-between">
    {/* Friend's Photo and Info */}
    <div className="flex items-center gap-4">
      {/* User Photo */}
      <UserPhoto lg={true} userId={friend._id} user={friend} />

      {/* Full Name and Age */}
      <div className="flex flex-col">
        <Link to={`/profile/${friend._id}`}>
          <p className="cursor-pointer text-gray-800 text-lg font-semibold hover:text-blue-600 transition-all duration-200">
            {friend.fullname}
          </p>
        </Link>
        <p className="text-sm text-gray-600">{age} years old today! 🎉</p>
      </div>
    </div>

    {/* Wish Button */}
    <button
      className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-all duration-200"
      onClick={() => console.log("Wish clicked!")}
    >
      <i className="ri-gift-fill text-lg"></i>
      <span className="text-sm">Wish</span>
    </button>
  </div>

  {/* Birthday Message */}
  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
    <p className="text-sm text-gray-700">
      It's {friend.fullname}'s birthday today! Send him your best wishes. 🎂
    </p>
    {/* Time Left */}
    {timeLeft && (
      <p className="mt-2 text-xs text-gray-500">
        Time left: <span className="font-medium">{timeLeft}</span>
      </p>
    )}
  </div>
</div>
  );
}

export default UsersBirthdaysPage;

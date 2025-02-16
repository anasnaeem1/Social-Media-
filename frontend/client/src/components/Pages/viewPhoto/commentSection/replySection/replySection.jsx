import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
// import { format } from "timeago.js";
// import {
//   RiThumbUpLine,
//   RiMore2Line,
//   RiThumbUpFill,
//   RiReplyLine,
// } from "react-icons/ri";
// import UserPhoto from "../../../../userPhoto";
// import axios from "axios";
import SingleReply from "./singleReply";
import Reply from "../../../Home/feed/post/comments/reply";

function replySection({ replies, newReply, commentUser }) {
  const { dispatch, user } = useContext(UserContext);

  return (
    <div className="mt-4 pl-6 border-l-2 border-blue-300">
      {replies?.map((reply) => (
        <div key={reply._id} className="flex items-start gap-3 mt-4">
            <Reply reply={reply} newReply={newReply} />
        </div>
      ))}
    </div>
  );
}
export default replySection;

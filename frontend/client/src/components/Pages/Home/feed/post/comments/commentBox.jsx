import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../../../../context/UserContext";
import { getComments, uploadPhoto } from "../../../../../../apiCalls";
import Comment from "./Comment";
import CommentSumbitForm from "./commentSubmitForm";

function CommentBox({ post, postDetails, postUser, userId, ViewPhoto }) {
  const {
    dispatch,
    user,
    newComment: newCommentDetails,
  } = useContext(UserContext);
  const [newComment, setNewComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentPicture, setCommentPicture] = useState(null);
  const [commentPicPreview, setCommentPicPreview] = useState(null);
  const [fetchingComments, setFetchingComments] = useState(false);
  const commentText = useRef();

  // const { postId } = useParams();

  useEffect(() => {
    const fetchComments = async () => {
      const postId = post?._id;
      try {
        setFetchingComments(true);
        if (postId) {
          getComments();
          const fetchedComments = await getComments(postId);
          setComments(fetchedComments);
          setFetchingComments(false);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [post._id]);

  useEffect(() => {
    if (newCommentDetails) {
      setComments((prevComments) => [newCommentDetails, ...prevComments]);
      setNewComment(true);
    }
  }, [newCommentDetails]);

  return (
    <>
      {/* Comments Section */}
      <div
        id="comment-box"
        className={`${
          postDetails || ViewPhoto ? " max-w-full" : "max-w-[540px]"
        } relative flex flex-col w-full max-w-[540px] px-2 border-t border-gray-300`}
      >
        {/* Header Section */}
        <div className="flex justify-between items-center py-5">
          <h2 className="text-base font-semibold text-gray-800">Comments</h2>
          <button className="text-sm text-blue-600 hover:underline">
            Filter Comments
          </button>
        </div>

        {/* Comments List */}
        <div
          className={`${
            ViewPhoto || postDetails
              ? "h-auto overflow-hidden"
              : " max-h-[280px] overflow-y-auto"
          } flex flex-col gap-3 overflow-x-hidden pr-2`}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "lightgray transparent",
          }}
        >
          {fetchingComments ? (
            <p className="text-sm text-gray-500">Loading comments.</p>
          ) : post?._id && comments?.length > 0 ? (
            comments.map((comment) => (
              <Comment
                ViewPhoto={ViewPhoto}
                userId={userId}
                postId={post?._id}
                postUser={postUser}
                newComment={newComment}
                newCommentDetails={newCommentDetails}
                key={comment._id}
                comment={comment}
              />
            ))
          ) : (
            <div className={`${postDetails ? "h-[190px]" : ""} `}>
              <p className="text-sm text-gray-500">No comments yet.</p>
            </div>
          )}
        </div>

        {/* Add Comment Input */}
        {/* <CommentSumbitForm /> */}
      </div>
    </>
  );
}

export default CommentBox;

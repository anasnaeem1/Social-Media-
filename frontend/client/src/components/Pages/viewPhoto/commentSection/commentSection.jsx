import { useEffect, useRef, useState, useCallback, useContext } from "react";
import { getComments, uploadPhoto } from "../../../../apiCalls";
import SingleComment from "./singleComment";
import axios from "axios";
import { UserContext } from "../../../context/UserContext";
import Comment from "../../Home/feed/post/comments/Comment";

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [fetchingComments, setFetchingComments] = useState(false);
  const { dispatch, user } = useContext(UserContext);

  useEffect(() => {
    const fetchComments = async () => {
      if (!postId) return;

      try {
        setFetchingComments(true);
        const fetchedComments = await getComments(postId);
        setComments(fetchedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setFetchingComments(false);
      }
    };

    fetchComments();
  }, [postId]);

  return (
    <div className="relatives border flex flex-col">
      {/* Comments List - Scrollable */}
      <div id="comments-container" className="flex-1 p-3">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200">
              <Comment comment={comment} />
            </div>
          ))
        ) : (
          <div className="border-b border-gray-200">
            <p>No comments Found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentSection;

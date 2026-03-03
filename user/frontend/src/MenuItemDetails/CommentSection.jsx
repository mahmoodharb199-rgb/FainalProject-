import { useState, useEffect } from "react";
import axios from "axios";

const CommentSection = ({ menuItemId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComments();
    const storedUserId = localStorage.getItem("userID");
    setUserId(storedUserId);
  }, [menuItemId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/comments/${menuItemId}`
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments. Please try again later.");
    }
  };

  const handleSubmit = async (e, parentId = null) => {
    e.preventDefault();
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to post a comment.");
        return;
      }

      const commentData = {
        menuItemId,
        content: parentId ? e.target.replyContent.value : newComment,
        parentId,
      };

      console.log("Sending comment data:", commentData);

      const response = await axios.post(
        "http://localhost:4000/api/comments",
        commentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Server response:", response.data);

      if (parentId) {
        e.target.replyContent.value = "";
      } else {
        setNewComment("");
      }
      setReplyingTo(null);
      fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
      if (error.response) {
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
        setError(
          `Failed to post comment: ${
            error.response.data.message || "Unknown error"
          }`
        );
      } else if (error.request) {
        console.error("Error request:", error.request);
        setError("Failed to post comment: No response received from server");
      } else {
        console.error("Error message:", error.message);
        setError(`Failed to post comment: ${error.message}`);
      }
    }
  };

  const handleEdit = async (commentId, newContent) => {
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to edit a comment.");
        return;
      }

      await axios.put(
        `http://localhost:4000/api/comments/${commentId}`,
        { content: newContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComments();
      setEditingComment(null);
    } catch (error) {
      console.error("Error editing comment:", error);
      setError("Failed to edit comment. Please try again later.");
    }
  };

  const handleDelete = async (commentId) => {
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to delete a comment.");
        return;
      }

      await axios.delete(`http://localhost:4000/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError("Failed to delete comment. Please try again later.");
    }
  };

  const Comment = ({ comment, depth = 0 }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);

    const handleEditSubmit = (e) => {
      e.preventDefault();
      handleEdit(comment._id, editContent);
      setIsEditing(false);
    };

    return (
      <div
        className={`bg-gray-100 p-4 rounded ${depth > 0 ? "ml-8 mt-2" : ""}`}
      >
        <div className="flex items-center mb-2">
          {comment.userId.image && (
            <img
              src={comment.userId.image}
              alt={comment.userId.name}
              className="w-8 h-8 rounded-full mr-2"
            />
          )}
          <span className="font-semibold">{comment.userId.name}</span>
        </div>
        {isEditing ? (
          <form onSubmit={handleEditSubmit}>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 border rounded bg-white"
              required
            />
            <button
              type="submit"
              className="mt-2 bg-green text-white px-4 py-2 rounded mr-2"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="mt-2 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <p>{comment.content}</p>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(comment.createdAt).toLocaleString()}
            </p>
            {userId === comment.userId._id && (
              <div className="mt-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-500 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            )}
            <button
              onClick={() => setReplyingTo(comment._id)}
              className="text-green mt-2"
            >
              Reply
            </button>
          </>
        )}
        {replyingTo === comment._id && (
          <form onSubmit={(e) => handleSubmit(e, comment._id)} className="mt-2">
            <textarea
              name="replyContent"
              className="w-full p-2 border rounded bg-white"
              placeholder="Write a reply..."
              required
            />
            <button
              type="submit"
              className="mt-2 bg-green text-white px-4 py-2 rounded mr-2"
            >
              Post Reply
            </button>
            <button
              onClick={() => setReplyingTo(null)}
              className="mt-2 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </form>
        )}
        {comment.replies &&
          comment.replies.map((reply) => (
            <Comment key={reply._id} comment={reply} depth={depth + 1} />
          ))}
      </div>
    );
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={(e) => handleSubmit(e)} className="mb-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-2 border rounded bg-white"
          placeholder="Write a comment..."
          required
        />
        <button
          type="submit"
          className="mt-2 bg-green text-white px-4 py-2 rounded"
        >
          Post Comment
        </button>
      </form>
      <div className="space-y-4">
        {comments.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;

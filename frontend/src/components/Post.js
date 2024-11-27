import React from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const Post = ({
  post,
  comments,
  currentUser,
  handleDelete,
  handleAddComment,
  newComment,
  setNewComment,
  getUsername,
}) => {
  const handleCommentChange = (e) => {
    // Update the newComment state for the specific post ID
    setNewComment((prev) => ({
      ...prev,
      [post._id]: e.target.value, // Ensure each post has its own comment value
    }));
  };

  return (
    <div className="post">
      {/* Post Header */}
      <div className="post-header">
        <div>
          <h2 className="post-title">{post.title}</h2>
          <p className="post-meta">
            Posted by {post.user} on{' '}
            {format(new Date(post.createdAt), 'PPP')}
          </p>
        </div>
        {currentUser && String(currentUser.id) === String(post.authorId) && (
    <button
        onClick={() => handleDelete(post._id)} // Use _id for deleting posts
        className="delete-btn"
    >
        <Trash2 className="icon" />
    </button>
)}
      </div>

      {/* Post Content */}
      <p className="post-content">{post.content}</p>

      {/* Comments Section */}
      <div className="comments-section">
        <h3 className="comments-title">
          <MessageSquare className="icon" />
          Comments
        </h3>

        {currentUser && (
          <div className="comment-input">
            <input
              type="text"
              value={newComment[post._id] || ''} // Ensure each input corresponds to a specific post
              onChange={handleCommentChange} // Update only this post's comment
              placeholder="Add a comment..."
              className="comment-input-field"
            />
            <button
              onClick={() => handleAddComment(post._id)} // Use _id here
              className="comment-btn"
            >
              Comment
            </button>
          </div>
        )}

        {/* Render Comments */}
        <div className="comment-list">
          {comments
            .filter((comment) => comment.postId === post._id) // Use _id to match comments to posts
            .map((comment) => (
              <div key={comment._id} className="comment">
                <div className="comment-header">
                  <p className="comment-author">{getUsername(comment.authorId)}</p>
                  <p className="comment-date">
                    {format(new Date(comment.createdAt), 'PPP')}
                  </p>
                </div>
                <p className="comment-content">{comment.content}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Post;

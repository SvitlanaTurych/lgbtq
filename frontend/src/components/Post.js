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
    setNewComment((prev) => ({
      ...prev,
      [post._id]: e.target.value,
    }));
  };

  return (
    <div className="post">
      <div className="post-header">
        <div>
          <h2 className="post-title">{post.title}</h2>
          <p className="post-meta">
            Posted by {post.user ? getUsername(post.user._id) : 'Unknown'} on {format(new Date(post.createdAt), 'PPP')}
          </p>
        </div>
        {currentUser && post.user && String(currentUser.id) === String(post.user._id) && (
          <button onClick={() => handleDelete(post._id)} className="delete-btn">
            <Trash2 className="icon" />
          </button>
        )}
      </div>
      <p className="post-content">{post.content}</p>

      <div className="comments-section">
        <h3 className="comments-title">
          <MessageSquare className="icon" />
          Comments
        </h3>

        {currentUser && (
          <div className="comment-input">
            <input
              type="text"
              value={newComment[post._id] || ''}
              onChange={handleCommentChange}
              placeholder="Add a comment..."
              className="comment-input-field"
            />
            <button
              onClick={() => handleAddComment(post._id)}
              className="comment-btn"
            >
              Comment
            </button>
          </div>
        )}

        <div className="comment-list">
          {comments
            .filter((comment) => String(comment.post) === String(post._id)) // Ensure matching by post ID
            .map((comment) => (
              <div key={comment._id} className="comment">
                <div className="comment-header">
                  <p className="comment-author">{comment.user ? comment.user.username : 'Unknown User'}</p>
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

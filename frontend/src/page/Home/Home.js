import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthProvider';
import { MessageSquare, Trash2 } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns'; // Import format from date-fns
import './Home.css'; // Import the CSS file

export const Home = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [newComment, setNewComment] = useState({});
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsResponse = await axios.get('http://localhost:5000/api/posts');
        const commentsResponse = await axios.get('http://localhost:5000/api/comments');
        const usersResponse = await axios.get('http://localhost:5000/api/users');
        
        setPosts(postsResponse.data);
        setComments(commentsResponse.data);
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`);
      setPosts(posts.filter(post => post.id !== postId));
      setComments(comments.filter(comment => comment.postId !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleAddComment = async (postId) => {
    if (!currentUser || !newComment[postId]) return;

    const comment = {
      content: newComment[postId],
      postId,
      authorId: currentUser.id,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await axios.post('http://localhost:5000/api/comments', comment);
      setComments([...comments, response.data]);
      setNewComment(prev => ({ ...prev, [postId]: '' }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const getUsername = (userId) => {
    return users.find(user => user.id === userId)?.username || 'Unknown User';
  };

  return (
    <div className="container">
      <div className="space-y-8">
        {posts.map(post => (
          <div key={post.id} className="post">
            <div className="post-header">
              <div>
                <h2 className="post-title">{post.title}</h2>
                <p className="post-meta">
                  Posted by {getUsername(post.authorId)} on {format(new Date(post.createdAt), 'PPP')}
                </p>
              </div>
              {currentUser?.id === post.authorId && (
                <button
                  onClick={() => handleDelete(post.id)}
                  className="delete-btn"
                >
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
                    value={newComment[post.id] || ''}
                    onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                    placeholder="Add a comment..."
                    className="comment-input-field"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="comment-btn"
                  >
                    Comment
                  </button>
                </div>
              )}
              
              <div className="comment-list">
                {comments
                  .filter(comment => comment.postId === post.id)
                  .map(comment => (
                    <div key={comment.id} className="comment">
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
        ))}
        
        {posts.length === 0 && (
          <div className="no-posts">
            <p>No posts yet. Be the first to share something!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

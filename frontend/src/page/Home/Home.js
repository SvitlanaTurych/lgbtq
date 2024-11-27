import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthProvider';
import axios from 'axios';
import Post from '../../components/Post';
import './Home.css';

export const Home = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({});
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsResponse = await axios.get('http://localhost:5000/api/posts/');
        const commentsResponse = await axios.get('http://localhost:5000/api/comments/');
        
        setPosts(postsResponse.data);
        setComments(commentsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (postId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No token found');

      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error.response?.data || error.message);
    }
  };

  const handleAddComment = async (postId) => {
    if (!currentUser || !newComment[postId]) return;

    const comment = {
      content: newComment[postId],
      post: postId,
      user: currentUser._id,
    };

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found');

      const response = await axios.post(`http://localhost:5000/api/comments/${postId}`, comment, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const populatedComment = response.data;
      console.log('Populated Comment from Response:', populatedComment);

      setComments([...comments, populatedComment]);
      setNewComment((prev) => ({ ...prev, [postId]: '' }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const getUsername = (userId) => {
    return comments.find((comment) => comment.user && comment.user._id === userId)?.user.username || 'Unknown User';
  };

  return (
    <div className="container">
      <div className="space-y-8">
        {posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            comments={comments}
            currentUser={currentUser}
            handleDelete={handleDelete}
            handleAddComment={handleAddComment}
            newComment={newComment}
            setNewComment={setNewComment}
            getUsername={getUsername}
          />
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

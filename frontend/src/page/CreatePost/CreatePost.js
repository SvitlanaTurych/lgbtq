import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthProvider';
import { PenTool } from 'lucide-react';
import axios from 'axios'; // Import axios for making HTTP requests
import './CreatePost.css'; // Import the CSS file

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the user is logged in
    if (!currentUser) {
      alert('You must be logged in to create a post!');
      return;
    }

    // Prepare the new post object
    const newPost = {
      title,
      content,
      authorId: currentUser.id,
      createdAt: new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem('authToken');
      console.log('Token:', token);
      // Send the POST request to the backend API
      await axios.post('http://localhost:5000/api/posts', newPost, {
        headers: {
          Authorization: `Bearer ${token}`, // Передаємо токен
        },
    });

      // Show success message and redirect to home
      alert('Post created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Помилка:', error.response || error.message);
      // Handle error if the request fails
      alert('Error creating post: ' + error.message);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="icon-container">
          <PenTool className="icon" />
        </div>
        
        <h2 className="title">Create a New Post</h2>
        
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label className="label">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="label">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="textarea"
              required
            />
          </div>
          
          <div className="buttons">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
            >
              Create Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
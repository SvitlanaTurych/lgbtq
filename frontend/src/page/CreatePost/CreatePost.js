import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthProvider';
import { PenTool } from 'lucide-react';
import axios from 'axios'; 
import './CreatePost.css'; 

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert('You must be logged in to create a post!');
      return;
    }

    const newPost = {
      title,
      content,
      authorId: currentUser.id,
      createdAt: new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem('authToken');
      console.log('Token:', token);

      await axios.post('http://localhost:5000/api/posts', newPost, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
    });

      alert('Post created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Помилка:', error.response || error.message);

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
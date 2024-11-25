import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../AuthProvider';
import { UserPlus } from 'lucide-react';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Save user data to the database via API (instead of localStorage)
      console.log('Sending data:', { username, email, password });
      const response = await axios.post('http://localhost:5000/api/auth/register', { 
            username, 
            email, 
            password 
        });
        console.log(response.data);

      if (response.status === 201) {
        navigate('/login');
      } else {
        setError('Username or email already exists');
      }
    } catch (error) {
      setError('An error occurred during registration');
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <div className="icon-container">
          <UserPlus className="icon" />
        </div>

        <h2 className="title">Create an Account</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label className="label">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

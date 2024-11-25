import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import { Heart } from 'lucide-react';
import './Header.css'; // Import the CSS file

const Header = () => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <Heart className="logo-icon" />
            <span>LGBTQ+ Forum</span>
          </Link>
          
          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            {currentUser ? (
              <>
                <Link to="/create-post" className="nav-link"> CreatePost</Link>
                <div className="user-info">
                  <span className="welcome-message">Welcome, {currentUser.username}!</span>
                  <button
                    onClick={logout}
                    className="logout-button"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="auth-links">
                <Link
                  to="/login"
                  className="auth-link login-link"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="auth-link register-link"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

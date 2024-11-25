import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context for user authentication
const AuthContext = createContext();

// AuthProvider component
const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsLoggedIn(!!token);
    }, []);

    useEffect(() => {
        // Try to get the user from localStorage or any other persistent state
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user) {
          setCurrentUser(user);
        }
      }, []);
    
      const login = (user) => {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      };
    
      const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
      };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
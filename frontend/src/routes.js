import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Register from './page/Register/Register';
import Login from './page/Login/Login';
import Posts from './components/Posts';
import { useAuth } from './AuthProvider'; // Custom hook from the context provider

// Component to protect routes
const ProtectedRoute = ({ element, ...rest }) => {
    const { isLoggedIn } = useAuth();
    return isLoggedIn ? element : <Navigate to="/login" />;
};

// Define your routes
const AppRoutes = () => {
    return (
        <>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute element={<Posts />} />} />
        </>
    );
};

export default AppRoutes;

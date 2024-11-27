import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));
    const [currentUser, setCurrentUser] = useState(() => {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    });

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const user = JSON.parse(localStorage.getItem('currentUser'));

        if (token && user) {
            setIsLoggedIn(true);
            setCurrentUser(user);
        } else {
            setIsLoggedIn(false);
            setCurrentUser(null);
        }
    }, []);

    const login = (user, token) => {
        console.log('Авторизація користувача:', user);
        setCurrentUser(user); 
        localStorage.setItem('currentUser', JSON.stringify(user)); 
        localStorage.setItem('authToken', token); 
        setIsLoggedIn(true); 
        console.log('Авторизація успішна. Поточний користувач:', user, 'Увійшов:', true); 
    };
    
    const logout = () => {
        console.log("Logging out user.");
        setCurrentUser(null); 
        localStorage.removeItem('currentUser'); 
        localStorage.removeItem('authToken'); 
        setIsLoggedIn(false); 
        console.log('Logout successful. Is logged in:', false); 
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;

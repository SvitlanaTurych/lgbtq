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
        setCurrentUser(user); // Оновлення поточного користувача
        localStorage.setItem('currentUser', JSON.stringify(user)); // Збереження користувача
        localStorage.setItem('authToken', token); // Збереження токена
        setIsLoggedIn(true); // Оновлення стану входу
        console.log('Авторизація успішна. Поточний користувач:', user, 'Увійшов:', true); // Підтвердження успіху
    };
    
    const logout = () => {
        console.log("Logging out user.");
        setCurrentUser(null); // Reset the current user
        localStorage.removeItem('currentUser'); // Remove user from localStorage
        localStorage.removeItem('authToken'); // Remove token from localStorage
        setIsLoggedIn(false); // Set isLoggedIn to false when logging out
        console.log('Logout successful. Is logged in:', false); // Confirm logout state
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;

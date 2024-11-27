const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        console.log('JWT_SECRET:', process.env.JWT_SECRET);

        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            console.log('No token provided');
            return res.status(400).send({ message: 'Authorization token not found' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);

        const user = await User.findById(decoded.id);
        if (!user) {
            console.log('User not found');
            return res.status(404).send({ message: 'User not found' });
        }

        req.user = user;
        next(); 
    } catch (error) {
        console.error('Auth Middleware Error:', error.message);  
        res.status(401).send({ message: 'Будь ласка, авторизуйтеся.' });  
    }
};

module.exports = auth;

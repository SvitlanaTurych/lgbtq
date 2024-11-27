const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        console.log('JWT_SECRET:', process.env.JWT_SECRET);
        // Перевірка на наявність Authorization заголовка
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        console.log('No token provided');

        if (!token) {
            console.log('No token provided');
            return res.status(400).send({ message: 'Authorization token not found' });
        }

        // Декодуємо токен
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);

        // Шукаємо користувача за ID з токена
        const user = await User.findById(decoded.id);
        if (!user) {
            console.log('User not found');
            return res.status(404).send({ message: 'User not found' });
        }

        // Додаємо користувача до запиту
        req.user = user;
        next(); // Продовжуємо виконання наступного middleware або маршруту
    } catch (error) {
        console.error('Auth Middleware Error:', error.message);  // Логування для відлагодження
        res.status(401).send({ message: 'Будь ласка, авторизуйтеся.' });  // Повідомлення про помилку
    }
};

module.exports = auth;

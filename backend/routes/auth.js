const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser  = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser ) return res.status(400).json({ message: 'Користувач вже існує' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser  = new User({ username, email, password: hashedPassword });
        await newUser .save();
        res.status(201).json({ message: 'Користувач створений' });
    } catch (error) {
 res.status(500).json({ message: 'Виникла помилка при створенні користувача' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user  = await User.findOne({ username });
        if (!user ) return res.status(400).json({ message: 'Неправильне ім\'я користувача або пароль' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Неправильне ім\'я користувача або пароль' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Виникла помилка при авторизації' });
    }
});

module.exports = router;
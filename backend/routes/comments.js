const express = require('express');
const Post = require('../models/Post'); 
const Comment = require('../models/Comment');
const router = express.Router();

// Створити коментар
router.post('/:postId', async (req, res) => {
    const postId = req.params.postId;

    console.log('Post ID from URL:', postId);

    const { content } = req.body;
    const user = req.user;  // Припускаємо, що user додано через middleware

    // Перевірка, чи є вміст коментаря
    if (!content || content.trim() === '') {
        return res.status(400).json({ message: 'Content cannot be empty' });
    }

    // Перевірка, чи існує користувач
    if (!user || !user._id) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    try {
        // Перевірка, чи існує пост
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Створення нового коментаря
        const comment = new Comment({ content, post: postId, user: user._id });
        await comment.save();

        // Повертаємо створений коментар
        res.status(201).json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Отримати всі коментарі
router.get('/', async (req, res) => {
    try {
        const comments = await Comment.find().populate('user', 'username'); // Populate with user data
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

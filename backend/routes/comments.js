const express = require('express');
const Post = require('../models/Post'); // Додаємо імпорт Post
const Comment = require('../models/Comment');
const router = express.Router();

// Створити коментар
router.post('/:postId', async (req, res) => {
    const postId = req.params.id;
    const { content } = req.body;
    const user = req.user;  // Припускаємо, що user додано через middleware

    if (!content || content.trim() === '') {
        return res.status(400).json({ message: 'Content cannot be empty' });
    }

    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const comment = new Comment({ content, post: postId, user: user._id });
        await comment.save();

        res.status(201).json(comment);  // Повертаємо сам коментар
    } catch (error) {
        console.error(error);  // Додаємо логування помилок
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

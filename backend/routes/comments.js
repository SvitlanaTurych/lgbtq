const express = require('express');
const Comment = require('../models/Comment');
const router = express.Router();

// Створити коментар
router.post('/:postId', async (req, res) => {
    const postId = req.params.postId;
    const { content } = req.body;
    const user = req.user;

    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const comment = new Comment({ content, post: postId, user: user._id });
        await comment.save();

        res.status(201).json({ message: 'Comment created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
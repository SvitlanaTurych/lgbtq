const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

// Створення поста
router.post('/', auth, async (req, res) => {
    const { title, content } = req.body;
    try {
        const newPost = new Post({ title, content, user: req.user.id });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: 'Виникла помилка при створенні поста' });
    }
});

// Отримання всіх постів
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('user', 'username').populate('comments');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Виникла помилка при отриманні постів' });
    }
});

// Видалення поста
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Пост не знайдено' });
        if (post.user.toString() !== req.user.id) return res.status(403).json({ message: 'Доступ заборонено' });

        await post.remove();
        res.json({ message: 'Пост видалено' });
    } catch (error) {
        res.status(500).json({ message: 'Виникла помилка при видаленні поста' });
    }
});

module.exports = router;
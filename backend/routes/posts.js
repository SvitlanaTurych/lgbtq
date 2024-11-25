const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

// Створення поста
router.post('/', auth, async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: 'Назва та контент обов\'язкові' });
    }

    try {
        const newPost = new Post({ title, content, user: req.user.id });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Виникла помилка при створенні поста', error: error.message });
    }
});

// Отримання всіх постів
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('user', 'username').populate('comments');
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Виникла помилка при отриманні постів', error: error.message });
    }
});

// Видалення поста
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Пост не знайдено' });
        }
        if (post.user && post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Доступ заборонено' });
        }

        await post.remove();
        res.json({ message: 'Пост видалено' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Виникла помилка при видаленні поста', error: error.message });
    }
});

module.exports = router;

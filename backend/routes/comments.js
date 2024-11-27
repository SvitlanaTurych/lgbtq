const express = require('express');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/:postId', auth, async (req, res) => {
  const postId = req.params.postId;
  const { content } = req.body;
  const user = req.user;

  if (!content || content.trim() === '') {
    return res.status(400).json({ message: 'Content cannot be empty' });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = new Comment({ content, post: postId, user: user._id });
    await comment.save();

    const populatedComment = await Comment.findById(comment._id).populate('user', 'username');
    console.log('Populated Comment:', populatedComment);

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error('Error adding comment:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find().populate('user', 'username');
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

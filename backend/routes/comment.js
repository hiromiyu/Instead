const router = require('express').Router();
const Comment = require('../models/Comment');
// const Post = require('../models/Post');

//新しいコメントの作成
router.post('/', async (req, res) => {
  const newComment = new Comment(req.body);
  try {
    const savedComment = await newComment.save();
    return res.status(200).json(savedComment);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//タイムラインのコメントを取得する
router.get('/timeline/:id', async (req, res) => {
  try {
    const postComments = await Comment.find({ postId: req.params.id });
    return res.status(200).json(postComments);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//コメントの削除
router.delete('/:id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (comment.userId === req.body.userId) {
      await comment.deleteOne();
      return res.status(200).json('コメント削除に成功しました！');
    } else {
      return res.status(403).json('あなたは他の人のコメントを削除できません');
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;

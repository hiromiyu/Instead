require("dotenv").config();
const router = require('express').Router();
const e = require('express');
const Post = require("../models/Post");
const User = require('../models/User');
const supabase = require('../libs/supabaseClient');


//投稿を作成する
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        return res.status(200).json(savedPost);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//投稿を更新する
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({
                $set: req.body,
            });
            return res.status(200).json("投稿編集に成功しました！");
        } else {
            return res.status(403).json("あなたは他の人の投稿を編集できません");
        }
    } catch (err) {
        return res.status(403).json(err);
    }
});

//投稿を削除する
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            const fileKey = post.img
            const response = await supabase.storage
                .from('instead')
                .remove([fileKey]);
            await post.deleteOne();

            return res.status(200).json("投稿削除に成功しました！");
        } else {
            return res.status(403).json("あなたは他の人の投稿を削除できません");
        }
    } catch (err) {
        return res.status(403).json(err);
    }
});

//全投稿を削除する
router.delete("/:username/deleteall", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        const fileKey = user.profilePicture
        const coverKey = user.coverPicture
        const postfind = await Post.find({ userId: user._id });
        const postKey = postfind.map(post => post.img)
        const fileKeys = [fileKey, coverKey, ...postKey];
        const response = await supabase.storage
            .from('instead')
            .remove(fileKeys);
        await Post.deleteMany({ userId: user._id });

        return res.status(200).json("全投稿削除に成功しました！");
    } catch (err) {
        return res.status(403).json(err);
    }
});

//特定の投稿を取得する
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        return res.status(200).json(post);
    } catch (err) {
        return res.status(403).json(err);
    }
});

//特定の投稿にいいねを押す
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        //まだ投稿にいいねが押されていなかったら
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({
                $push: {
                    likes: req.body.userId,
                },
            });
            await post.updateOne({
                isLiked: true,
            });
            return res.status(200).json("投稿にいいねを押しました！");
            //投稿にすでにいいねが押されていたら
        } else {
            //いいねしているユーザーIDを取り除く
            await post.updateOne({
                $pull: {
                    likes: req.body.userId,
                },
            });
            await post.updateOne({
                isLiked: false,
            });
            return res.status(200).json("投稿にいいねを外しました");
        }
    } catch (err) {
        return res.status(500).json(err);
    }
});

//プロフィール専用のタイムラインの取得
router.get("/profile/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        const posts = await Post.find({ userId: user._id });
        return res.status(200).json(posts);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//タイムラインの投稿を取得する
router.get("/timeline/:userId", async (req, res) => {
    try {
        // const currentUser = await User.findById(req.params.userId);
        // const userPosts = await Post.find({ userId: currentUser._id });
        //友達の投稿内容を全て取得する。
        // const friendPosts = await Promise.all(
        //     currentUser.followings.map((friendId) => {
        //         return Post.find({ userId: friendId });
        //     })
        // );

        const allPosts = await Post.find();
        return res.status(200).json(allPosts);
        // return res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;
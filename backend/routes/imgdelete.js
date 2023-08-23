require("dotenv").config();
const router = require('express').Router();
const supabase = require('../libs/supabaseClient');
const User = require("../models/User");

//アイコン画像削除用API
router.delete("/:id/deleteIcon", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const fileKey = user.profilePicture
        const response = await supabase.storage
            .from('instead')
            .remove([fileKey]);

        return res.status(200).json("アイコン画像削除に成功しました！");
    } catch (err) {
        return res.status(500).json(err);
    }
});

//カバー画像削除用API
router.delete("/:id/deleteCover", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const fileKey = user.coverPicture
        const response = await supabase.storage
            .from('instead')
            .remove([fileKey]);

        return res.status(200).json("アイコン画像削除に成功しました！");
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;
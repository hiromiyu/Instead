const router = require('express').Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require("dotenv").config();

//ユーザー登録
router.post("/register", async (req, res) => {
    try {
        const newUser = await new User({
            username: req.body.username,
            email: req.body.email,
            // password: req.body.password,
            password: bcrypt.hashSync(req.body.password, 10),
        });

        const user = await newUser.save();
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//Appleユーザー登録
router.post("/apple/register", async (req, res) => {
    try {
        const newUser = await new User({
            username: req.body.username,
            email: req.body.email,
        });

        const user = await newUser.save();
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//ログイン
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).send("ユーザーが見つかりません");

        // const vailedPassword = req.body.password === user.password;
        const vailedPassword = bcrypt.compareSync(req.body.password, user.password)
        if (!vailedPassword) return res.status(400).json("パスワードが違います");

        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//Appleログイン
router.post("/apple/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).send("ユーザーが見つかりません");
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//iosログイン
router.post("/ios/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).send("ユーザーが見つかりません");

        // const vailedPassword = req.body.password === user.password;
        const vailedPassword = bcrypt.compareSync(req.body.password, user.password)
        if (!vailedPassword) return res.status(400).json("パスワードが違います");

        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
            expiresIn: "1d",
        });
        user.tokens = user.tokens.concat({ token })
        await user.save()

        return res.send({ user, token });
    } catch (err) {
        return res.status(500).json(err);
    }
});

// const auth = async (req, res, next) => {
//     try {
//         const token = req.header('Authorization').replace('Bearer ', '')
//         const decoded = jwt.verify(token, process.env.SECRET_KEY)

//         const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

//         if (!user) {
//             throw new Error('User doesnt exist')
//         }

//         req.token = token
//         req.user = user
//         next()
//     }
//     catch (err) {
//         res.status(500).json(err)
//     }
// }

module.exports = router;
const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

//ユーザー登録
router.post('/register', async (req, res) => {
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
router.post('/apple/register', async (req, res) => {
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
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send('ユーザーが見つかりません');

    const vailedPassword = bcrypt.compareSync(req.body.password, user.password);
    if (!vailedPassword) return res.status(400).json('パスワードが違います');

    const accessToken = jwt.sign({ ...user.toJSON() }, ACCESS_SECRET, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign({ ...user.toJSON() }, REFRESH_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ ...user.toJSON(), accessToken });
  } catch (err) {
    return res.status(500).json(err);
  }
});
// router.post('/login', async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) return res.status(404).send('ユーザーが見つかりません');

//     const vailedPassword = bcrypt.compareSync(req.body.password, user.password);
//     if (!vailedPassword) return res.status(400).json('パスワードが違います');

//     return res.status(200).json(user);
//   } catch (err) {
//     return res.status(500).json(err);
//   }
// });

// Refresh endpoint
router.post('/refresh', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).send('No token');

  jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid token');

    const newAccessToken = jwt.sign({ user }, ACCESS_SECRET, {
      expiresIn: '15m',
    });
    res.status(200).json({ ...user, accessToken: newAccessToken });
  });
});

router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true, // 本番は true
    sameSite: 'none', // 本番で secure:true の場合は "none"
  });
  res.status(200).json({ message: 'Logged out' });
});

//Appleログイン
router.post('/apple/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send('ユーザーが見つかりません');
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//iosログイン
router.post('/ios/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send('ユーザーが見つかりません');

    // const vailedPassword = req.body.password === user.password;
    const vailedPassword = bcrypt.compareSync(req.body.password, user.password);
    if (!vailedPassword) return res.status(400).json('パスワードが違います');

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn: '1d',
    });
    user.tokens = user.tokens.concat({ token });
    await user.save();

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

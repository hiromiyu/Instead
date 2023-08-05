const express = require("express");
const app = express();
const router = express.Router();
const userRoute = require("../routes/users");
const authRoute = require("../routes/auth");
const postRoute = require("../routes/posts");
const uploadRoute = require("../routes/upload");
// const PORT = 4000;
// const PORT = 443;
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
// const cors = require("cors");

// const corsOptions = {
//     origin: 'https://dayce-sns-frontend.vercel.app',
//     credentials: true,
//     optionsSuccessStatus: 200
// }

// データベース接続
mongoose.connect(process.env.MONGOURL)
    .then(() => {
        console.log("DBに接続します");
    })
    .catch((err) => {
        console.log(err);
    });

//ミドルウェア
// app.get('/user/:userId', cors(corsOptions), function (res) {
//     res.json({ msg: 'https://dayce-sns-frontend.vercel.appからのアクセスのみ許可' })
// });

app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/upload", uploadRoute);
// app.use(express.static(path.join(__dirname, '../frontend/build')));


router.get("/", (res) => {
    try {
        return res.send("Hello World!");
    } catch (err) {
        return res.status(500).json(err);
    }
})

// app.get('*', (res) => {
//     res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
// });

// app.use(express.static(path.join(__dirname, 'build')));

// app.get('/*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });


// app.get("/users", (req, res) => {
//     res.send("users World!");
// })

app.listen(port, () => console.log("サーバーが起動しました"));

const express = require("express");
const app = express();
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const uploadRoute = require("./routes/upload");
const imgdeleteRoute = require("./routes/imgdelete");
const commentRoute = require("./routes/comment");
require("dotenv").config();
const port = process.env.PORT || 4000;
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const axios = require("axios");

const corsOptions = {
    origin: ["https://instead.vercel.app", "https://assgin.pages.dev"],
    // origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 200
}

// データベース接続
mongoose.connect(process.env.MONGOURL)
    .then(() => {
        console.log("DBに接続します");
    })
    .catch((err) => {
        console.log(err);
    });

// ミドルウェア

app.get('/', cors(corsOptions), (req, res) => res.send('Hello World!'));

// フォームデータを受け取ってGASにリレー
app.post("/contact", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // GASにPOSTリクエスト
        await axios.post(process.env.GASURL, {
            name: name,
            email: email,
            message: message
        });

        // フロントエンドに成功メッセージを返す
        res.json({ success: true, message: "お問い合わせありがとうございました！" });
    } catch (error) {
        console.error("Error sending to GAS:", error);
        res.status(500).json({ success: false, message: "送信に失敗しました" });
    }
});

app.use(express.urlencoded({ extended: true }));  // URLエンコードデータを受け取る
app.use("/images", cors(corsOptions), express.static(path.join(__dirname, "public/images")));
app.use(cors(corsOptions), express.json());
app.use("/api/users", cors(corsOptions), userRoute);
app.use("/api/auth", cors(corsOptions), authRoute);
app.use("/api/posts", cors(corsOptions), postRoute);
app.use("/api/upload", cors(corsOptions), uploadRoute);
app.use("/api/imgdelete", cors(corsOptions), imgdeleteRoute);
app.use("/api/comment", cors(corsOptions), commentRoute);

app.listen(port, cors(corsOptions), () => console.log("サーバーが起動しました"));
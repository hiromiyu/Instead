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
    origin: ["https://instead.vercel.app", "https://assgin.pages.dev", process.env.GASURL],
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

app.use(express.urlencoded({ extended: true }));  // URLエンコードデータを受け取る
app.use("/images", cors(corsOptions), express.static(path.join(__dirname, "public/images")));
app.use(cors(corsOptions), express.json());
app.use("/api/users", cors(corsOptions), userRoute);
app.use("/api/auth", cors(corsOptions), authRoute);
app.use("/api/posts", cors(corsOptions), postRoute);
app.use("/api/upload", cors(corsOptions), uploadRoute);
app.use("/api/imgdelete", cors(corsOptions), imgdeleteRoute);
app.use("/api/comment", cors(corsOptions), commentRoute);

// フォームデータを受け取ってGASにリレー
app.post("/contact", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        console.log({ name, email, message });

        const params = new URLSearchParams();
        params.append("name", name);
        params.append("email", email);
        params.append("message", message);

        // GASにPOSTリクエスト
        // await axios.post(process.env.GASURL, {
        //     name: name,
        //     email: email,
        //     message: message
        // }, {
        //     headers: {
        //         "Content-Type": "application/json"
        //     }
        // });

        const response = await axios.post(process.env.GASURL, params, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        console.log("GAS response:", response.data);

        // フロントエンドにHTMLでメッセージを返す
        res.send(`
            <!DOCTYPE html>
            <html lang="ja">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>お問い合わせ完了</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    .message { font-size: 18px; color: #333; }
                    .button { 
                        display: inline-block; 
                        margin-top: 20px; 
                        padding: 10px 20px; 
                        background-color: #007bff; 
                        color: white; 
                        text-decoration: none; 
                        border-radius: 5px;
                    }
                </style>
            </head>
            <body>
                <h2>お問い合わせありがとうございます！</h2>
                <p class="message">内容を確認の上、通常2営業日以内にご返信いたします。<br>今しばらくお待ちくださいませ。</p>
                <a href="/" class="button">ホームに戻る</a>
            </body>
            </html>
        `);
    } catch (error) {
        console.error("Error sending to GAS:", error);

        res.send(`
            <!DOCTYPE html>
            <html lang="ja">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>エラーが発生しました</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    .error { font-size: 18px; color: red; }
                    .button { 
                        display: inline-block; 
                        margin-top: 20px; 
                        padding: 10px 20px; 
                        background-color: #dc3545; 
                        color: white; 
                        text-decoration: none; 
                        border-radius: 5px;
                    }
                </style>
            </head>
            <body>
                <h2>エラーが発生しました</h2>
                <p class="error">申し訳ありません。送信に失敗しました。<br>時間をおいて再度お試しください。</p>
                <a href="/" class="button">ホームに戻る</a>
            </body>
            </html>
        `);
    }
});

app.listen(port, cors(corsOptions), () => console.log("サーバーが起動しました"));
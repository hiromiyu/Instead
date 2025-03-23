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
const bodyParser = require("body-parser");
const admin = require("./firebase");
const jwt = require("jsonwebtoken");

const corsOptions = {
    origin: ["https://instead.vercel.app", "https://assgin.pages.dev", process.env.GASURL, "https://instead-86614.firebaseapp.com"],
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

app.use(bodyParser.json());

app.post("/verify-apple-token", async (req, res) => {
    const { idToken } = req.body;

    try {
        // Appleの公開鍵取得
        const appleKeysRes = await axios.get("https://appleid.apple.com/auth/keys");
        const appleKeys = appleKeysRes.data.keys;

        // ID Tokenを検証
        const decoded = jwt.decode(idToken, { complete: true });
        const kid = decoded.header.kid;
        const key = appleKeys.find(k => k.kid === kid);

        if (!key) {
            return res.status(400).send("Invalid key ID");
        }

        // 公開鍵を使ってJWT検証
        const publicKey = jwt.createPublicKey({
            key: key,
            format: "jwk",
        });

        jwt.verify(idToken, publicKey, { algorithms: ["RS256"] });

        const uid = decoded.payload.sub;

        // Firebaseのカスタムトークン作成
        const firebaseToken = await admin.auth().createCustomToken(uid);

        res.send({ firebaseToken });
    } catch (err) {
        console.error(err);
        res.status(500).send("Token verification failed");
    }
});

// フォームデータを受け取ってGASにリレー
app.post("/contact", async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const params = new URLSearchParams();
        params.append("name", name);
        params.append("email", email);
        params.append("message", message);

        const response = await axios.post(process.env.GASURL, params, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        res.status(200).json({ success: true, message: "お問い合わせが完了しました" });
    } catch (error) {
        console.error("Error sending to GAS:", error);
        res.status(500).json({ success: false, message: "送信に失敗しました" });
    }
});

app.listen(port, cors(corsOptions), () => console.log("サーバーが起動しました"));
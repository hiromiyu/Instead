const express = require("express");
const app = express();
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const uploadRoute = require("./routes/upload");
// const PORT = 4000;
const PORT = 443;
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

// データベース接続
mongoose.connect(process.env.MONGOURL)
    .then(() => {
        console.log("DBに接続します");
    })
    .catch((err) => {
        console.log(err);
    });

//ミドルウェア
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/upload", uploadRoute);

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// app.get("/", (req, res) => {
//     res.send("Hello World!");
// })
// app.get("/users", (req, res) => {
//     res.send("users World!");
// })

app.listen(PORT, () => console.log("サーバーが起動しました"));

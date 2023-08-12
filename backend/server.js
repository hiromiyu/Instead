const express = require("express");
const app = express();
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const uploadRoute = require("./routes/upload");
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
const cors = require("cors");

const corsOptions = {
    origin: "https://instead.vercel.app",
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

app.use("/images", cors(corsOptions), express.static(path.join(__dirname, "public/images")));
app.use(cors(corsOptions), express.json());
app.use("/api/users", cors(corsOptions), userRoute);
app.use("/api/auth", cors(corsOptions), authRoute);
app.use("/api/posts", cors(corsOptions), postRoute);
app.use("/api/upload", cors(corsOptions), uploadRoute);

app.listen(port, cors(corsOptions), () => console.log("サーバーが起動しました"));
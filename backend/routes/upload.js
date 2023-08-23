require('dotenv').config();
const router = require('express').Router();
const multer = require("multer");
const supabase = require('../libs/supabaseClient');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//画像アップロード用API
router.post("/", upload.single("file"), async (req, res) => {
    try {
        const response = await supabase.storage
            .from('instead')
            .upload(req.body.name, req.file.buffer);

        return res.status(200).json("画像アップロードに成功しました！");
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;
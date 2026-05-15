const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("video"), async (req, res) => {
  try {
    const query = req.body.query;
    const file = req.file;

    console.log("Query:", query);
    console.log("File path:", file.path);

    const formData = new FormData();
    formData.append("query", query);
    formData.append("video", fs.createReadStream(file.path));

    const aiResponse = await axios.post(
      "http://127.0.0.1:8000/process",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    console.log("AI response:", aiResponse.data);

    res.json(aiResponse.data);

  } catch (error) {
    console.error("ERROR:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
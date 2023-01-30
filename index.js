const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const PORT = process.env.PORT || 4001;
const QRCode = require("qrcode");
const fs = require("fs");
const Jimp = require("jimp"); //------------------

const app = express();
app.use(express.json());
app.use(cors());
app.get("/", async (req, res) => {
  try {
    const {
      base64 = false,
      bgColor = "#FFF",
      color = "#000",
      margin = 1,
      quality = 0.95,
      text = "Hello world",
      file = "png",
      transparent = false,
      git,
    } = req.body;

    const opts = {
      quality,
      margin,
      color: {
        dark: color,
        light: bgColor,
      },
    };
    QRCode.toDataURL(text, opts, function (err, url) {
      if (err) {
        console.log(err);
        return res.status(200).send(err);
      }
      console.log(url);
      const buffer = Buffer.from(url, "base64");
      Jimp.read(buffer, (err, res) => {
        console.log(res);
        if (err) throw new Error(err);
        res.quality(5).write("resized.jpg");
      });

      res.status(200).send(url);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

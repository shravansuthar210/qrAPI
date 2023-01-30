const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const PORT = process.env.PORT || 4000;
const QRCode = require("qrcode");

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
      file="png",
      transparent=false,
      git 
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

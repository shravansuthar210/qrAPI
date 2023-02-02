const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const PORT = process.env.PORT || 4001;
const QRCode = require("qrcode");
const fs = require("fs");
const Jimp = require("jimp"); //------------------
var path = require("path");
// https://www.npmjs.com/package/qr-code-styling
var QRCodeStyling = require("@chromapdx/qr-code-styling");
const app = express();
app.use(express.json());
app.use(cors());
// app.use("/",require("./route/createQRImage"))
const { readFile } = require("fs");
const { promisify } = require("util");
const asyncReadFile = promisify(readFile);

const returnSvg = async (path = "k.svg") => {
  const data = await asyncReadFile(path);

  // since fs.readFile returns a buffer, we should probably convert it to a string.
  return data.toString();
};
app.get("/", async (req, res) => {
  try {
    const {
      base64 = false,
      bgColor = "#FFF",
      color = "#ff0000",
      margin = 1,
      quality = 0.95,
      text = "Hello world",
      type = "svg", //"image/png",
      transparent = false,
      download = true,
      size,
    } = req.body;

    const opts = {
      type,
      quality,
      margin,
      color: {
        dark: color,
        light: bgColor,
      },
    };

    if (type === "svg" || type === "SVG") {
      const url = await QRCode.toFile("k.svg", text, opts);
      returnSvg()
        .then((data) => {
          res.status(200).send(data);
        })
        .catch((err) => {
          console.log(`failed to read svg file: ${err}`);
          res.status(200).send(data);
        });
    }

    // function (err, url) {
    //   if (err) {
    //     console.log(err);
    //     return res.status(200).send(err);
    //   }
    //   console.log(url);
    //   const buffer = Buffer.from(url, "base64");
    //   Jimp.read(buffer, (err, res) => {
    //     if (err) throw new Error(err);
    //     if (size) {
    //       res.resize(size.width, size.height);
    //     }
    //     res.quality(100).write("resized.png");
    //   });
    //   res.status(200).send("./resized.jpg");
    // }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

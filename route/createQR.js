const route = require("express").Router();
const Jimp = require("jimp"); 

route.post("/QRcode", async (req, res) => {
  try {
    const {
      download = false,
      bgColor = "#FFF",
      color = "#ff0000",
      margin = 1,
      quality = 0.95,
      text = "Hello world",
      extension = "image/png",
    } = req.body;

    const opts = {
      extension,
      quality,
      margin,
      color: {
        dark: color,
        light: bgColor,
      },
    };
    if (download) {
      QRCode.toDataURL(text, opts, function (err, url) {
        if (err) {
          console.log(err);
          return res.status(200).send(err);
        }
        console.log(url);
        const buffer = Buffer.from(url, "base64");
        Jimp.read(buffer, (err, res) => {
          if (err) throw new Error(err);
          if (size) {
            res.resize(size.width, size.height);
          }
          res.quality(100).write("resized.png");
        });
        res.status(200).send("./resized.jpg");
      });
    }
    QRCode.toDataURL(text, opts, function (err, url) {
      if (err) {
        console.log(err);
        return res.status(200).send(err);
      }
      console.log(url);
      return res.status(200).json({
        base64: url,
      });
    });
  } catch (error) {
    return res.status(500).send("something went wrong");
  }
});

module.exports = route;

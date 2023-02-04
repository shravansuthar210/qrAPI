const Jimp = require("jimp");
const QRCode = require("qrcode");
const { readFile } = require("fs");
const { promisify } = require("util");
const formidable = require("formidable");
const asyncReadFile = promisify(readFile);

const returnSvg = async (path = "upload/k.svg") => {
  const data = await asyncReadFile(path);
  return data.toString();
};

const generateOR = async (req, res) => {
  try {
    const form = formidable({ multiples: true });
    var fields = await new Promise(function (resolve, reject) {
      form.parse(req, function (err, fields, files) {
        if (err) {
          reject(err);
          return;
        }
        resolve(fields);
      }); // form.parse
    });
    const {
      margin = 1,
      color = "#000",
      quality = 0.95,
      download = false,
      bgColor = "#FFF",
      text = "Hello world",
      extension = "image/png",
    } = fields;

    const opts = {
      margin,
      quality,
      extension,
      color: {
        dark: color,
        light: bgColor,
      },
    };
    console.log(extension);
    if (extension === "svg" || extension === "SVG") {
      const ksvg = await QRCode.toFile("upload/k.svg", text, opts);
      return returnSvg()
        .then((data) => {
          return res.status(200).send(data);
        })
        .catch((err) => {
          return res.status(200).send("Error");
        });
    }
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
    } else {
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
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("something went wrong");
  }
};

module.exports = generateOR;

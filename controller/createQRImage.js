const Jimp = require("jimp");
const QRCode = require("qrcode");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");

const { createCanvas, loadImage } = require("canvas");
async function create(dataForQRcode, center_image, width, cwidth, opts) {
  const canvas = createCanvas(width, width);
  QRCode.toCanvas(canvas, dataForQRcode, opts);

  const ctx = canvas.getContext("2d");
  const img = await loadImage(center_image);
  const center = (width - cwidth) / 2;
  ctx.drawImage(img, center, center, cwidth, cwidth);
  return canvas.toDataURL("image/png");
}
// route.post(
//   "/centerLogoQr",
//   multer({ storage }).single("image"),
const QRImage = async (req, res) => {
  try {
    const form = formidable({ multiples: true });
    var requestData = await new Promise(function (resolve, reject) {
      form.parse(req, function (err, fields, files) {
        if (err) {
          reject(err);
          return;
        }
        var oldPath = files.image.filepath;
        var image = fs.readFileSync(oldPath);
        fs.writeFile("upload/w.png", image, function (err) {
          if (err) console.log(err);
          resolve({
            fields,
            image:
              "data:image/gif;base64," +
              fs.readFileSync("upload/w.png", "base64"),
          });
        });
      });
    });
    const {
      size = 150,
      margin = 1,
      quality = 0.95,
      bgColor = "#FFF",
      color = "#ff0000",
      centerImageSize = 50,
      text = "Hello world",
      extension = "image/png",
    } = requestData.fields;

    const opts = {
      margin,
      quality,
      extension,
      errorCorrectionLevel: "H",
      color: {
        dark: color,
        light: bgColor,
      },
    };
    const qrCode = await create(
      text,
      requestData.image,
      size,
      centerImageSize,
      opts
    );
    return res.status(200).send(qrCode);
  } catch (error) {
    console.log(error);
    return res.status(500).send("something went wrong");
  }
};

module.exports = QRImage;

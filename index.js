const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
var multer = require("multer");

dotenv.config();
const PORT = process.env.PORT || 4001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./upload/");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});
app.post("/generateQR", require("./controller/createQR"));
app.post(
  "/centerLogoQr",
  // multer({ storage }).single("image"),
  require("./controller/createQRImage")
);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

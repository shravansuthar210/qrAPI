const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");

dotenv.config();
const PORT = process.env.PORT || 4001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post("/generateQR", require("./controller/createQR"));
app.post("/centerLogoQr", require("./controller/createQRImage"));

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

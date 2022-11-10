const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// home route
app.use("/", (req, res) => {
  res.send("Ordering API working");
});

const CONFIG = require("./config/config");

// Server
const port = CONFIG.port;
app.listen(port, () => {
  console.log(`Listening on: http://localhost:${port}`);
});

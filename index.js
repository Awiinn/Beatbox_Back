const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.json({ limit: "200mb" }));
app.use(
  express.urlencoded({ limit: "200mb", extended: true, parameterLimit: 50000 })
);
app.use(express.text({ limit: "200mb" }));

app.use("/", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth", require("./auth/index.js"));
app.use("/api", require("./api/index.js"));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;

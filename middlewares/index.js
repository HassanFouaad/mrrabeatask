const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(express.json({ extended: false }));
app.use(morgan("dev"));
app.use(cors());

exports = module.exports = app;
//Importing
require("dotenv").config();
const express = require("express");
const userRouter = require("./routes/user");
//App define
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const path = require("path");
//Db Config
require("./config");

//App MiddleWares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.get("/", express.static(path.join(__dirname, "/public")));
app.use(morgan("dev"));
app.use(cors());

//API ROUTING
app.use("/api", userRouter);
//Listening
app.listen(PORT, () => {
  console.log(`Server is listening on Port: ${PORT}`);
});

module.exports = app;

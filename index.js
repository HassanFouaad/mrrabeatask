//Importing
require("dotenv").config();
const express = require("express");

//App define
const app = express();

//Db Config
require("./config");

//App MiddleWares
require("./middlewares");

//API ROUTING

//Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on Port: ${PORT}`);
});

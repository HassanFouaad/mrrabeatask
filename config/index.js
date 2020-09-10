const mongoose = require("mongoose");

mongoose.connect(
  process.env.DATABASEURL,
  { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true },
  (err, connected) => {
    if (err) {
      return console.error(err);
    }
    console.log("Mongo Database has been connected to the server");
  }
);

exports = module.exports = mongoose;

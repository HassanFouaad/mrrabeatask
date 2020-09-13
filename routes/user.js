const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  userSignUpValidator,
  validate,
  userSigninValidator,
} = require("../validate/auth");
const path = require("path");
const auth = require("../middlewares/auth");
const User = require("../models/user");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");
const multer = require("multer");

/*-----------------Sign Up API ROUTE------------------*/
router.post("/signup", userSignUpValidator(), validate, async (req, res) => {
  try {
    const { firstname, lastname, email, username, password } = req.body;
    console.log(req.body);
    ///See if user exitsts
    let user = await User.findOne({ username }).select("-password");

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    user = new User({
      firstname,
      lastname,
      email,
      username,
      password,
    });

    //Encrypt Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    //Saving User
    await user.save();
    //Return JSONWEBTOKEN
    const payload = {
      user,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ user, token });
      }
    );
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

/* -------------------------- Handling Sign in ----------------------- */

router.post("/signin", userSigninValidator(), validate, async (req, res) => {
  let { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        error: "Username doesn't exists, Please Signup and try again",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invaild Credentials" });
    }

    const payload = {
      user,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});
/* -------------------------- -------------- ------------------------------- */

/* -------------------------- ------Edit Profile-------- --------------------- */
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "-" + uniqueSuffix + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 300,
  },
  fileFilter,
});

function makeMulterUploadMiddleware(multerUploadFunction) {
  return (req, res, next) =>
    multerUploadFunction(req, res, (err) => {
      // handle Multer error
      if (err && err.name && err.name === "MulterError") {
        return res.status(500).send({
          message: `${err.message} `,
        });
      }
      // handle other errors
      if (err) {
        return res.status(500).send({
          error: "FILE UPLOAD ERROR",
          message: `Something wrong ocurred when trying to upload the file`,
        });
      }

      next();
    });
}
const multerUploadMiddleware = makeMulterUploadMiddleware(
  upload.single("avatar")
);

router.put("/user", auth, multerUploadMiddleware, async (req, res) => {
  try {
    let user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(400).json({ error: "No User Found" });
    }
    if (req.file) {
      user.avatar = req.file.path;
    }
    await user.update(req.body, { runValidators: true, context: "query" });
    res
      .status(200)
      .json({ msg: "You have sucessfully updated your profile"});
  } catch (error) {
    console.log(error.message);
    const err = Object.entries(error.errors);
    res.status(500).json({ error: Object.assign({}, err[0])[1].message });
  }
});

/* -------------------------- -----Getting User------ ------------------------------- */

router.get("/user/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) {
      return res.status(400).json({ error: "No User Found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "SERVER ERROR" });
  }
});
/* -------------------------- -------------- ------------------------------- */

/* -------------------------- ------Deleting User-------- ------------------------------- */
router.delete("/user/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) {
      return res.status(400).json({ error: "No User Found" });
    }
    user.remove();
    res.status(200).json({ msg: "User has been removed" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "SERVER ERROR" });
  }
});
/* -------------------------- -------------- ------------------------------------ */

/* -------------------------------Fetching all users--------------------- */
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    if (!users) {
      return res.status(400).json({ error: "No Users Found" });
    }
    res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "SERVER ERROR" });
  }
});

//------------------------------- Deleting All users------------------------------///
router.delete("/users", async (req, res) => {
  try {
    await User.remove({});
    res.status(200).json({ msg: "ALL USERS HAS BEEN DELETED" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "SERVER ERROR" });
  }
});
module.exports = router;

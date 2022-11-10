require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/auth.config");
const { v4: uuidv4 } = require("uuid");
const CONFIG = require("../config/config");
const response = require("../helpers/response.helper");
const db = require("../models");
const User = db.user;

generateLoginData = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      phone: user.phone,
    },
    config.secret,
    {
      expiresIn: 2592000, // 30 days
    }
  );

  var data = {
    accessToken: token,
  };
  return data;
};

exports.addUser = async (req, res) => {
  const name = req.body.name;
  let phone = req.body.phone;
  const password = req.body.password;

  if (
    name == null ||
    name === "" ||
    phone == null ||
    phone === "" ||
    password == null ||
    password === ""
  ) {
    return response.responseHelper(
      res,
      false,
      "All fields are required",
      "Failed to Add User"
    );
  }

  if (password.length < 8) {
    return response.responseHelper(
      res,
      false,
      "Password Length should be larger than of equal to 8",
      "Failed to Add User"
    );
  }

  if (phone.length < 10) {
    return response.responseHelper(
      res,
      false,
      "Invalid Phone Number",
      "Failed to Add User"
    );
  }

  try {
    let result = await User.findOne({
      where: {
        phone: phone,
      },
    });
    if (result) {
      return response.responseHelper(
        res,
        false,
        "This Phone is already in use, register with a new phone",
        "Failed to Add User"
      );
    } else {
      let user = await User.create({
        name,
        phone,
        password: bcrypt.hashSync(password, 10),
      });
      if (user) {
        return response.responseHelper(
          res,
          true,
          {
            user: user,
            token: generateLoginData(user),
          },
          "Sign Up successful"
        );
      }
    }
  } catch (error) {
    console.log(error);
    return response.responseHelper(res, false, "Error", "Something went wrong");
  }
};

exports.loginUser = async (req, res) => {
  let phone = req.body.phone;
  const password = req.body.password;

  if (phone == null || phone === "" || password == null || password === "") {
    return response.responseHelper(
      res,
      false,
      "All fields required",
      "Login failed"
    );
  }

  try {
    var user = await User.findOne({
      where: {
        phone: phone,
      },
    });

    if (!user) {
      return response.responseHelper(
        res,
        false,
        "Invalid Phone",
        "Login failed"
      );
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return response.responseHelper(
        res,
        false,
        "Wrong Password",
        "Login failed"
      );
    }
    return response.responseHelper(
      res,
      true,
      {
        user: user,
        token: generateLoginData(user),
      },
      "Login successful"
    );
  } catch (err) {
    console.log(err.message);
    return response.responseHelper(
      res,
      false,
      "Something went wrong",
      "Login failed"
    );
  }
};

exports.getUsers = async (req, res) => {
  try {
    var users = await User.findAll();

    return response.responseHelper(
      res,
      true,
      {
        users: users,
      },
      "Users found"
    );
  } catch (err) {
    console.log(err.message);
    return response.responseHelper(
      res,
      false,
      "Something went wrong",
      "Login failed"
    );
  }
};

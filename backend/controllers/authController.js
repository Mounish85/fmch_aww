const User = require("../models/User");
const jwt = require('jsonwebtoken');

//Handle Errors
const handleErrors = (err) => {
  console.log(err.message, err.code);

  let errors = { email: '', password: '' };

  //handle errors from login post request
  if(err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }
  if(err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }   

  //duplicate error code
  if(err.code === 11000) {
    errors.email = 'That email is already registered';
  }

  if(err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
    }

    return errors;
}

//Function for token creation
const maxAge = 3 * 24 * 60 * 60; //3 days in seconds
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge
  });
}


//Signup method
const signup_post = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    preferredLanguage
  } = req.body;

  try {
    const user = await User.create({
      name,
      email,
      password,
      role,
      preferredLanguage: preferredLanguage || "en"
    });

    const token = createToken(user._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        preferredLanguage: user.preferredLanguage
      }
    });

  } catch (err) {
    const errors = handleErrors(err);

    res.status(400).json({
      success: false,
      errors
    });
  }
};

//Embed the static user login method into the controller
const login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    const token = createToken(user._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        preferredLanguage: user.preferredLanguage
      }
    });

  } catch (err) {
    const errors = handleErrors(err);

    res.status(400).json({
      success: false,
      errors
    });
  }
};

//User Profile
const profile_get = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("_id name email role preferredLanguage");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        preferredLanguage: user.preferredLanguage
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile"
    });
  }
};

//Logout
const logout_get = (req, res) => {
  res.cookie("jwt", "", {
    maxAge: 1
  });
  res.redirect("http://localhost:5173/");
};

module.exports = {handleErrors, signup_post, login_post, profile_get,logout_get};
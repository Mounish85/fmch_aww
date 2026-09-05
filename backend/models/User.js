const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [6, "Minimum password length is 6 characters"],
    },

    role: {
      type: String,
      enum: ["AWW", "FMCH"],
      required: [true, "Please select a role"],
    },

    preferredLanguage: {
      type: String,
      default: "en",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//Hashing Password using bcrypt
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

//Static user login method
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({
    email: email.toLowerCase().trim() //Normalizing email
  });

  if (user) {
    const auth = await bcrypt.compare(
      password,
      user.password
    );

    if (auth) {
      return user;
    }

    throw Error("incorrect password");
  }

  throw Error("incorrect email");
};

const User = mongoose.model("User", userSchema);

module.exports = User;
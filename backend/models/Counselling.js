const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const counsellingSchema = new Schema(
    {
    beneficiary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Beneficiary",
      required: true,
    },

    conductedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    inputs: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    recommendation: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["completed", "in-progress"],
      default: "in-progress",
    },
  },
  {
    timestamps: true,
  }
);

//Model
const Counselling = mongoose.model("counselling",counsellingSchema);
module.exports = Counselling;
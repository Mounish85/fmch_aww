const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const benificiarySchema = new Schema(
    {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
      min: 0,
    },

    contactNumber: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Benificiary = mongoose.model("benificiary",benificiarySchema);
module.exports = Benificiary;
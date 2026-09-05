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

let Benificiary;
try {
  Benificiary = mongoose.model("Beneficiary");
} catch (e) {
  Benificiary = mongoose.model("Beneficiary", benificiarySchema);
}
try {
  mongoose.model("benificiary", benificiarySchema);
} catch (e) {}

module.exports = Benificiary;
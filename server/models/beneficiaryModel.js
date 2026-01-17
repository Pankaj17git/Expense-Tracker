const mongoose = require("mongoose");

const beneficiarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bankName: {
      type: String,
      required: true,
    },

    ifsc: {
      type: String,
      required: true,
    },

    accountNumber: {
      type: String,
      required: true,
    },

    nickname: {
      type: String,
      required: true,
    },

    accountType: {
      type: String,
      enum: ["Savings", "Current", "Salary", "NRI"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Beneficiary", beneficiarySchema);

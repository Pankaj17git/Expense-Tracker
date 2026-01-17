const mongoose = require('mongoose')

const loanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["Personal", "Car", "Education", "Home", "Business"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    term: {
      type: Number, // months
      required: true,
    },

    rate: {
      type: Number, // interest %
      required: true,
    },

    EMI: {
      type: Number,
      required: true,
    },

    startDate: {
      type: String, // YYYY-MM-DD
      required: true,
    },

    endDate: {
      type: String, // YYYY-MM-DD
      required: true,
    },

    emiPaidCount: {
      type: Number,
      default: 0,
    },

    createdAt: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports =  mongoose.model("Loan", loanSchema);

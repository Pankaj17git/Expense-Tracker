const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },

    type: {
      type: String,
      enum: {
        values: ["income", "expense"],
        message: "Type must be either income or expense",
      },
      required: [true, "Transaction type is required"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
    },

    mode: {
      type: String,
      trim: true,
      required: [true, "Payment mode is required"],
    },

    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be greater than 0"],
    },

    balance: {
      type: Number,
      required: [true, "Balance is required"],
    },

    date: {
      type: String, // stored as YYYY-MM-DD
      required: [true, "Transaction date is required"],
      match: [
        /^\d{4}-\d{2}-\d{2}$/,
        "Date must be in YYYY-MM-DD format",
      ],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [300, "Description cannot exceed 300 characters"],
    },

    createdAt: {
      type: String,
      default: () =>
        new Date().toISOString().replace("T", " ").substring(0, 19),
    },
  },
  {
    timestamps: true, 
  }
); 
module.exports = mongoose.model("Transaction", transactionSchema);


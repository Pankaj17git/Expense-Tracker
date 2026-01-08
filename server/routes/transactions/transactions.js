const express = require("express");
const { body } = require("express-validator");
const { validationResult } = require("express-validator");
const Transaction = require("../../models/transactionModel");
const authMiddleware = require("../../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/api/transactions",
  authMiddleware,
  [
    body("type")
      .isIn(["income", "expense"])
      .withMessage("Type must be income or expense"),

    body("category").notEmpty().withMessage("Category is required"),

    body("mode").notEmpty().withMessage("Mode is required"),

    body("amount")
      .isFloat({ gt: 0 })
      .withMessage("Amount must be greater than 0"),

    body("date")
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("Date must be in YYYY-MM-DD format"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    next();
  },
  async (req, res) => {
    try {
      const {
        type,
        category,
        mode,
        amount,
        date,
        description,
      } = req.body;

      const userId = req.user._id; 

      // 🔹 Get last transaction of user
      const lastTransaction = await Transaction.findOne({ userId })
        .sort({ createdAt: -1 });

      const previousBalance = lastTransaction
        ? lastTransaction.balance
        : 0;

      let calculatedBalance = previousBalance;

      if (type === "income") {
        calculatedBalance += Number(amount);
      } else if (type === "expense") {
        calculatedBalance -= Number(amount);
      }

      if (calculatedBalance < 0) {
        return res.status(400).json({
          message: "Insufficient balance for this expense",
        });
      }

      const transaction = await Transaction.create({
        userId,
        type,
        category,
        mode,
        amount,
        balance: calculatedBalance,
        date,
        description,
      });

      return res.status(201).json({
        message: "Transaction created successfully",
        transaction,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Server error",
      });
    }
  }
);

module.exports = router;

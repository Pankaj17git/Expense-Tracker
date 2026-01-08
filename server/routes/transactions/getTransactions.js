const express = require("express");
const { body } = require("express-validator");
const { validationResult } = require("express-validator");
const Transaction = require("../../models/transactionModel");
const authMiddleware = require("../../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/api/transactions",
  authMiddleware,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    next();
  },
  async (req, res) => {
  try {
    const userId = req.user._id;

    // pagination (optional)
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments({ userId });

    return res.status(200).json({
      total,
      page,
      limit,
      transactions,
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

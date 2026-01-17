const express = require("express");
const { validationResult } = require("express-validator");
const authMiddleware = require("../../middleware/authMiddleware");
const Loan = require("../../models/loanModel");

const router = express.Router();

router.get(
  "/api/loans",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = req.user._id;

      const loans = await Loan.find({ userId }).sort({ createdAt: -1 });
      return res.status(200).json(loans);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;

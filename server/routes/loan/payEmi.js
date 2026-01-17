const express = require("express");
const { validationResult } = require("express-validator");
const authMiddleware = require("../../middleware/authMiddleware");
const Loan = require("../../models/loanModel");

const router = express.Router();
router.patch(
  "/api/loans/:id/pay-emi",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = req.user._id;
      const { id } = req.params;

      const loan = await Loan.findOne({ _id: id, userId });
      if (!loan)
        return res.status(404).json({ message: "Loan not found" });

      if (loan.emiPaidCount >= loan.term) {
        return res.status(400).json({ message: "Loan already completed" });
      }

      loan.emiPaidCount += 1;
      await loan.save();

      return res.status(200).json({
        message: "EMI paid successfully",
        emiPaidCount: loan.emiPaidCount,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;

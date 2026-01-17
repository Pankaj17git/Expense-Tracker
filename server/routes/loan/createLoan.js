const express = require("express");
const { validationResult } = require("express-validator");
const authMiddleware = require("../../middleware/authMiddleware");
const Loan = require("../../models/loanModel");

const router = express.Router();


router.post(
  "/api/loans",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = req.user._id; 

      const loan = new Loan({
        ...req.body,
        userId, 
      });

      const savedLoan = await loan.save();
      return res.status(201).json(savedLoan);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);



module.exports = router;

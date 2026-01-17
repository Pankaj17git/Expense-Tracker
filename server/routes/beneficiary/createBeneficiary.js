const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const Beneficiary = require("../../models/beneficiaryModel");

const router = express.Router();

/* ================= CREATE BENEFICIARY ================= */
router.post(
  "/api/beneficiaries",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = req.user._id;

      const beneficiary = new Beneficiary({
        ...req.body,
        userId, // 🔐 injected securely
      });

      const saved = await beneficiary.save();
      res.status(201).json(saved);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;

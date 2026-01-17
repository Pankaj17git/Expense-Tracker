const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const Beneficiary = require("../../models/beneficiaryModel");

const router = express.Router();

router.get(
  "/api/beneficiaries",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = req.user._id;

      const list = await Beneficiary.find({ userId }).sort({
        createdAt: -1,
      });

      res.status(200).json(list);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;

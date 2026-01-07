const express = require('express');
const { body } = require('express-validator');
const { validationResult } = require('express-validator');
const User = require('../../models/userModel.js');
const router = express.Router();

// Register
router.post('/api/register',
  [
    body('name')
      .trim()
      .isLength({ min: 3, max: 30 }).withMessage('name 3-30 chars')
      .matches(/^[a-zA-Z0-9-_]+$/).withMessage('name can contain letters, numbers, - and _'),
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
      .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
      .matches(/\d/).withMessage('Password must contain a number')
    // optionally: .matches(/[^A-Za-z0-9]/).withMessage('Password must contain a special character')
  ],
  async (req, res) => {
    // express-validator results
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    console.log("inside the function--------------", req.body);

    try {
      // check duplicates
      let existing = await User.findOne({ $or: [{ email }, { name }] });
      if (existing) {
        if (existing.email === email) return res.status(409).json({ message: 'Email already registered' });
        return res.status(409).json({ message: 'name already taken' });
      }

      const user = new User({ name, email, password });
      console.log(" user created", user);
      await user.save();

      const token = user.generateJWT();
      // return user safe object
      const userObj = user.toJSON();
      return res.status(201).json({ user: userObj, token });
    } catch (err) {
      console.error(err);
      console.log("error in catch block");

      return res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;



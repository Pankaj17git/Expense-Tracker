const express = require('express');
const { body } = require('express-validator');
const { validationResult } = require('express-validator');
const User = require('../../models/userModel.js');
const router = express.Router();

router.post('/api/login',
    [
        body('email').notEmpty().withMessage('Email required'),
        body('password').notEmpty().withMessage('Password required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;

        try {
            // allow login by email or username
            const user = await User.findOne({ email }).select('+password');

            if (!user) return res.status(401).json({ message: 'Invalid credentials' });

            const isMatch = await user.comparePassword(password);
            if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

            const token = user.generateJWT();
            const userObj = user.toJSON();
            return res.json({ user: userObj, token });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }
    }
);

module.exports = router;



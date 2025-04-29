const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register
exports.register = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await User.create({email, password});
        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(201).json({token});
    } catch (error) {
        next();
    }
};

// Login
exports.login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({error: 'Invalid credentials'});
        }
        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn:'1h'});
        res.json(token);
    } catch (error) {
        next(error);
    }
};

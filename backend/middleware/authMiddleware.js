const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
    const token = req.headers.authorization?.split('')[1];
    if (!token) return res.status(401).json({error: 'No token provided'});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({error: 'Invalid token'});
    }
};

exports.admin = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({error: 'Admin access required'});
    next();
};

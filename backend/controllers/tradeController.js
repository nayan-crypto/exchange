const Order = require('../models/Order');
const Wallet = require('../models/Wallet');
const {matchOrder} = require('../services/orderMatching');

// Place order
exports.placeOrder = async (req, res, next) => {
    try {
        const {pair, type, quantity, price} = req.body;
        const userId = req.user.id;

        // Check wallet balance
        const wallet = await Wallet.findOne({userId, currency: type === 'buy' ? 'USDT' : pair.split('/')[0]});
        if (!wallet || wallet.balance < price*quantity) {
            return res.status(400).json({error: 'Insufficient balance'});
        }

        const order = await Order.create({userId, pair, type, price, quantity});
        await matchOrder(order); // Simplified matching logic

        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
};

// Get orderbook
exports.getOrderBook = async (req, res, next) => {
    try {
        const {pair} = req.params;
        const buyOrders = await Order.find({pair, type: 'buy', status: 'open'}).sort({price: -1});
        const sellOrders = await Order.find({pair, type: 'sell', status: 'open'}).sort({price: 1});
        res.json({buyOrders, sellOrders});
    } catch (error) {
        next(error);
    }
};

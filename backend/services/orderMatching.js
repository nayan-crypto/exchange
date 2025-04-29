const Order = require('../models/Order');
const Wallet = require('../models/Wallet');

// Match order
exports.matchOrder = async (newOrder) =>{
    const oppositeType = newOrder.type === 'buy' ? 'sell' : 'buy';
    const orders = await Order.find({
        pair: newOrder.pair,
        type: oppositeType,
        status:'open',
        price: newOrder.type === 'buy' ? { $lte: newOrder.price} : {$gte: newOrder.price},
    }).sort({price: newOrder.type === 'buy' ? 1 : -1});

    for (let order of orders) {
        if (newOrder.quantity <= 0) break;

        const matchedQuantity = Math.min(newOrder.quantity, order.quantity);
        newOrder.quantity -= matchedQuantity;
        orderQuantity -= matchedQuantity;

        // Update wallets
        await Wallet.updateOne(
            {userId: order.userId, currency: newOrder.pair.split('/')[0]},
            {$inc: {balance: order.type === 'buy' ? matchedQuantity : -matchedQuantity}}
        );

        // Update order statuses
        if (order.quantity === 0) order.status = 'filled';
        await order.save();
    }

    if (newOrder.quantity === 0) newOrder.status = 'filled';
    await newOrder.save();
};

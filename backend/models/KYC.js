const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    documentType:{
        type: String,
        enum: ['passport', 'id_card', 'driver_license']
    },
    documentUrl: {
        type: String
    },  // URL for uploaded document
    submittedAt: {
        type: Date,
        default: Date.now
    },
    verifiedAt: {
        type: Date
    }
});

module.exports = mongoose.model('KYC', kycSchema);

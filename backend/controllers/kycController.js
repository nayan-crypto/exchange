const KYC = require('../models/KYC');
const User = require('../models/User');
const {verifyIdentity} = require('../services/kycService');

// Submit KYC
exports.submitKYC = async (req, res, next) => {
    try {
        const {documentType, documentFile} = req.body; // Assume file uploaded
        const userId = req.user.id;

        const kyc = await Kyc.create({
            userId,
            documentType,
            documentUrl: documentFile    
        });

        const verificationResult = await verifyIdentity(documentFile, documentType);
        kyc.status = verificationResult.status;
        kyc.verifiedAt = verificationResult.verifiedAt;
        await kyc.save();

        if (kyc.status === 'approved') {
            await User.findByIdAndUpdate(userId, {kycVerified: true});
        }

        res.status(201).json(kyc);
    } catch (error) {
        next(error);
    }
};

// KYC status
exports.getKYCStatus = async (req, res, next) => {
    try {
        const kyc = await KYC.findOne({userId: req.user.id});
        res.json(kyc || {status: 'not_submittted'});
    } catch (error) {
        next(error);
    }
};

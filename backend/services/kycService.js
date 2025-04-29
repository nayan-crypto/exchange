const axios = require('axios');

exports.verifyIdentity = async (documentUrl, documentType) => {
    try {
        const response = await axios.post('https://api.shuftipro.com', {
            reference: `KYC_${Date.now()}`,
            document: {
                type: documentType,
                proof: documentUrl,
            },
            // Add more AML/KYC parameters as per Shufti Pro API
        }, {
            headers: {Authorization: `Basic ${process.env.SHUFTI_PRO_API_KEY }`},
        });

        return {
            status: response.data.verification_result ? 'approved' : 'rejected',
            verifiedAt: new Date()
        };
    } catch (error) {
        throw new Error('KYC verification failed');
    }
};

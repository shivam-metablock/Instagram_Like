import mongoose from 'mongoose';

const paymentConfigSchema = new mongoose.Schema({
    upiId: {
        type: String,
        required: true,
        default: 'admin@upi'
    },
    qrCodeUrl: {
        type: String,
        default: ''
    },
    instructions: {
        type: String,
        default: 'Please pay to the UPI ID above and upload the screenshot.'
    }
}, {
    timestamps: true,
});

const PaymentConfig = mongoose.model('PaymentConfig', paymentConfigSchema);

export default PaymentConfig;

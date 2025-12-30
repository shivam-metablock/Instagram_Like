import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        required: true,
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
        default: 'PENDING',
    },
    amount: {
        type: Number,
        required: true,
    },
    utr: {
        type: String,
    },
    screenshotPath: {
        type: String,
    },
    rejectionReason: {
        type: String,
    },
    video: {
        type: String,
    },
    compeletedStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'In Progress', 'Cenceled'],
        default: 'Pending',
    }
}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

export default Order;

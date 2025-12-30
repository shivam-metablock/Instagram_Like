import Order from '../models/Order.js';
import User from '../models/User.js';
import WalletTransaction from '../models/WalletTransaction.js';
import mongoose from 'mongoose';

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
// Admin gets all orders, User gets their own
export const getOrders = async (req, res) => {
    try {
        let query = {};
        if (req.user.role !== 'ADMIN') {
            query.userId = req.user._id;
        }

        const orders = await Order.find({ ...query, status: { $ne: 'REJECTED' } })
            .populate('planId')
            .populate('userId', 'name email')
            .sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('planId')
            .populate('userId', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (req.user.role !== 'ADMIN' && order.userId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
    try {
        const { planId, amount, utr, video, paymentMethod } = req.body;

        let screenshotPath = '';
        let status = 'PENDING';

        if (paymentMethod === 'WALLET') {
            const user = await User.findById(req.user._id);
            if (!user || user.walletBalance < Number(amount)) {
                return res.status(400).json({ message: 'Insufficient wallet balance' });
            }

            // Deduct balance
            user.walletBalance -= Number(amount);
            await user.save();

            // Fetch plan details for description
            const plan = await mongoose.model('Plan').findById(planId);
            const planName = plan ? `${plan.platform} - ${plan.name}` : planId;

            // Create purchase transaction
            await WalletTransaction.create({
                userId: req.user._id,
                amount: Number(amount),
                type: 'PURCHASE',
                status: 'APPROVED',
                description: `Purchase of plan: ${planName}`
            });

            status = 'APPROVED'; // Mark as approved if paid by wallet
        } else {
            if (req.file) {
                screenshotPath = req.file.path.replace(/\\/g, '/'); // Normalize path
            }
        }

        const order = await Order.create({
            userId: req.user._id,
            planId,
            amount,
            utr: paymentMethod === 'WALLET' ? 'WALLET_PAYMENT' : utr,
            screenshotPath,
            status,
            video
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { status, rejectionReason } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        if (rejectionReason) {
            order.rejectionReason = rejectionReason;
        }

        await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).populate('planId')
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }
        order.compeletedStatus = req.body.compeletedStatus 
        await order.save()
        res.json(order)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

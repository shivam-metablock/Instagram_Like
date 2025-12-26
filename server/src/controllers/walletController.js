import WalletTransaction from '../models/WalletTransaction.js';
import User from '../models/User.js';

// @desc    Request to add balance to wallet
// @route   POST /api/wallet/deposit
// @access  Private
export const addBalanceRequest = async (req, res) => {
    try {
        const { amount, utr } = req.body;

        let screenshotPath = '';
        if (req.file) {
            screenshotPath = req.file.path.replace(/\\/g, '/');
        }

        const transaction = await WalletTransaction.create({
            userId: req.user._id,
            amount: Number(amount),
            utr,
            screenshotPath,
            type: 'DEPOSIT',
            status: 'PENDING',
            description: 'Wallet deposit request'
        });

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's wallet transactions
// @route   GET /api/wallet/transactions
// @access  Private
export const getMyTransactions = async (req, res) => {
    try {
        const transactions = await WalletTransaction.find({ userId: req.user._id })
            .sort('-createdAt');
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all pending deposits (Admin only)
// @route   GET /api/wallet/pending
// @access  Private/Admin
export const getPendingDeposits = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const transactions = await WalletTransaction.find({
            type: 'DEPOSIT',
            status: 'PENDING'
        })
            .populate('userId', 'name number')
            .sort('-createdAt');

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve or reject deposit (Admin only)
// @route   PUT /api/wallet/deposit/:id
// @access  Private/Admin
export const handleDepositStatus = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { status } = req.body;
        const transaction = await WalletTransaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        if (transaction.status !== 'PENDING') {
            return res.status(400).json({ message: 'Transaction already processed' });
        }

        transaction.status = status;
        await transaction.save();

        if (status === 'APPROVED') {
            const user = await User.findById(transaction.userId);
            if (user) {
                user.walletBalance = (user.walletBalance || 0) + transaction.amount;
                await user.save();
            }
        }

        res.json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

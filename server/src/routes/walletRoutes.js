import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    addBalanceRequest,
    getMyTransactions,
    getPendingDeposits,
    handleDepositStatus
} from '../controllers/walletController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Configure Multer for screenshots
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, 'wallet-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

router.post('/deposit', protect, upload.single('screenshot'), addBalanceRequest);
router.get('/transactions', protect, getMyTransactions);
router.get('/pending', protect, getPendingDeposits);
router.put('/deposit/:id', protect, handleDepositStatus);

export default router;

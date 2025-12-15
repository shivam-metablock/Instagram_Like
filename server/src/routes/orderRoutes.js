import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    getOrders,
    getOrder,
    createOrder,
    updateOrderStatus,getMyOrders
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Configure Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, 'proof-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

router.route('/')
    .get(protect, getOrders)
    .post(protect, upload.single('screenshot'), createOrder);

router.route('/my2')
    .get(protect, getMyOrders);

router.route('/:id')
    .get(protect, getOrder);

router.route('/:id/status')
    .put(protect, updateOrderStatus);

export default router;

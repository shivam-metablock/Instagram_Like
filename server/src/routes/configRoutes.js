import express from 'express';
import {
    getPaymentConfig,
    updatePaymentConfig,
    addHelpCenter
} from '../controllers/configController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

import multer from 'multer';
import path from 'path';

// Configure Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, 'qr-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

router.route('/payment')
    .get(getPaymentConfig)
    .put(protect, upload.single('qrCode'), updatePaymentConfig);
    router.post("/help-center",addHelpCenter)

export default router;

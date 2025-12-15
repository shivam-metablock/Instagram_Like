import express from 'express';
import {
    getProxies,
    createProxy,
    updateProxy,
    deleteProxy,
} from '../controllers/proxyController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(protect, admin, getProxies)
    .post(protect, admin, createProxy);

router.route('/:id')
    .put(protect, admin, updateProxy)
    .delete(protect, admin, deleteProxy);

export default router;

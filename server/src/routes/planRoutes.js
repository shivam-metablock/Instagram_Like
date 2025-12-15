import express from 'express';
import {
    getPlans,
    createPlan,
    updatePlan,
    deletePlan,
} from '../controllers/planController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(getPlans)
    .post(protect, admin, createPlan);

router.route('/:id')
    .put(protect, admin, updatePlan)
    .delete(protect, admin, deletePlan);

export default router;

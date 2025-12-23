import express from 'express';
import { registerUser, loginUser, getMe, getAllUsers ,updateMe} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe)
router.post('/me', protect, updateMe);
router.get('/users', protect, getAllUsers);

export default router;

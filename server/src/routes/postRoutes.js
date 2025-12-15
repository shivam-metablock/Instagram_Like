import express from 'express';
import {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
} from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(protect, getPosts)
    .post(protect, createPost);

router.route('/:id')
    .get(protect, getPost)
    .put(protect, updatePost)
    .delete(protect, deletePost);

export default router;

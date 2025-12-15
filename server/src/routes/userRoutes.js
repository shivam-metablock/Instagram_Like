
import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
const router = express.Router();

router.route('/')
    .get(protect, async(req,res)=>{
    const user= await User.findById(req.user._id).select('AccountLink AccountName email')
    res.json({data:user})
})
    
router.route('/Instagram')
    .post(protect, async(req,res)=>{
    const user= await User.findByIdAndUpdate(req.user._id,{AccountLink:req.body.accountLink,AccountName:req.body.accountName},{new:true})
    res.json({data:user})
})

export default router
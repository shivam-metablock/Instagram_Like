import HelpCenter from '../models/HelpCenter.js';
import PaymentConfig from '../models/PaymentConfig.js';

// @desc    Get payment config
// @route   GET /api/config/payment
// @access  Public (or semi-protected if needed, let's keep Public for user ease)
export const getPaymentConfig = async (req, res) => {
    try {
        let config = await PaymentConfig.findOne();
        if (!config) {
            config = await PaymentConfig.create({});
        }
        res.json(config);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update payment config
// @route   PUT /api/config/payment
// @access  Private/Admin
export const updatePaymentConfig = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { upiId, instructions } = req.body;
        let qrCodeUrl = req.body.qrCodeUrl;

        // Handle file upload
        if (req.file) {
            qrCodeUrl = req.file.path.replace(/\\/g, '/');
        }

        let config = await PaymentConfig.findOne();

        if (config) {
            config.upiId = upiId || config.upiId;
            config.qrCodeUrl = qrCodeUrl || config.qrCodeUrl;
            config.instructions = instructions || config.instructions;
            await config.save();
        } else {
            config = await PaymentConfig.create({
                upiId,
                qrCodeUrl,
                instructions
            });
        }

        res.json(config);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const addHelpCenter=async(req,res)=>{
    try {
        const {title}=req.body
        let helpCenter=await HelpCenter.findOne({})
        console.log("helpCenter",helpCenter);
        if(helpCenter){
            helpCenter.title=title
            await helpCenter.save()
        }else{
            helpCenter=await HelpCenter.create({title})
        }
        
        res.json(helpCenter)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
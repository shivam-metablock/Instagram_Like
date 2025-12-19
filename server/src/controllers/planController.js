import Plan from '../models/Plan.js';

// @desc    Get all plans
// @route   GET /api/plans?platform=INSTAGRAM
// @access  Public
export const getPlans = async (req, res) => {
    try {
        const { platform } = req.query;
        
        // Build filter object
    
        
        const plans =platform? await Plan.find({platform: platform}):await Plan.find({});
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create plan
// @route   POST /api/plans
// @access  Private/Admin
export const createPlan = async (req, res) => {
    try {
        const { name, description, price, features, type,platform } = req.body;

        const plan = await Plan.create({
            name,
            description,
            price,
            features,
            type,
            platform
        });

        res.status(201).json(plan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update plan
// @route   PUT /api/plans/:id
// @access  Private/Admin
export const updatePlan = async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        const updatedPlan = await Plan.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedPlan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete plan
// @route   DELETE /api/plans/:id
// @access  Private/Admin
export const deletePlan = async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        await plan.deleteOne();
        res.json({ message: 'Plan removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

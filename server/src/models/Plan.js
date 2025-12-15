import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    features: [{
        type: String,
    }],
    type: {
        type: String,
        enum: ['SEO', 'THUMBNAIL', 'INFLUENCER', 'ADS', 'BUNDLE', 'VIEWS'],
        default: 'SEO',
    },
    viewsCount: {
        type: Number,
        default: 0,
    },
    likesCount: {
        type: Number,
        default: 0,
    },
    followersCount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

const Plan = mongoose.model('Plan', planSchema);

export default Plan;

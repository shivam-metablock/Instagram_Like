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
        enum: ['LIKES', 'VIEWS', 'FOLLOWERS','BUNDLE'],
        default: 'LIKES',
    },
    platform: {
        type: String,
        enum: ['INSTAGRAM', 'FACEBOOK', 'YOUTUBE', 'TELEGRAM'],
        default: 'INSTAGRAM',
        required: true,
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

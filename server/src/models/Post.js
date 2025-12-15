import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
        default: 'Untitled Post',
    },
    simulatedViews: {
        type: Number,
        default: 0,
    },
    simulatedLikes: {
        type: Number,
        default: 0,
    },
    simulatedFollowers: {
        type: Number,
        default: 0,
    },
    engagementRate: {
        type: Number,
        default: 4.5,
    },
    proxiesUsed: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

const Post = mongoose.model('Post', postSchema);

export default Post;

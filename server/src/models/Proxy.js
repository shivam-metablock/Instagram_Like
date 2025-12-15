import mongoose from 'mongoose';

const proxySchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true,
    },
    port: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Active', 'Rotating', 'Idle'],
        default: 'Active',
    },
    username: {
        type: String,
        default: '',
    },
    password: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

const Proxy = mongoose.model('Proxy', proxySchema);

export default Proxy;

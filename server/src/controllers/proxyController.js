import Proxy from '../models/Proxy.js';

// @desc    Get all proxies
// @route   GET /api/proxies
// @access  Private/Admin
export const getProxies = async (req, res) => {
    try {
        const proxies = await Proxy.find({}).sort('-createdAt');
        res.json(proxies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create proxy
// @route   POST /api/proxies
// @access  Private/Admin
export const createProxy = async (req, res) => {
    try {
        const { ip, port, country, status, username, password } = req.body;

        const proxy = await Proxy.create({
            ip,
            port,
            country,
            status: status || 'Active',
            username,
            password,
        });

        res.status(201).json(proxy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update proxy
// @route   PUT /api/proxies/:id
// @access  Private/Admin
export const updateProxy = async (req, res) => {
    try {
        const proxy = await Proxy.findById(req.params.id);

        if (!proxy) {
            return res.status(404).json({ message: 'Proxy not found' });
        }

        const updatedProxy = await Proxy.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedProxy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete proxy
// @route   DELETE /api/proxies/:id
// @access  Private/Admin
export const deleteProxy = async (req, res) => {
    try {
        const proxy = await Proxy.findById(req.params.id);

        if (!proxy) {
            return res.status(404).json({ message: 'Proxy not found' });
        }

        await proxy.deleteOne();
        res.json({ message: 'Proxy removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

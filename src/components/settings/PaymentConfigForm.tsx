import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { configAPI } from '../../services/api';

export const PaymentConfigForm: React.FC = () => {
    const [config, setConfig] = useState({
        upiId: '',
        qrCodeUrl: '',
        instructions: ''
    });
    const [qrFile, setQrFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const data = await configAPI.getPaymentConfig();
            if (data) {
                setConfig({
                    upiId: data.upiId || '',
                    qrCodeUrl: data.qrCodeUrl || '',
                    instructions: data.instructions || ''
                });
            }
        } catch (error) {
            console.error('Failed to load payment config', error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setQrFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const formData = new FormData();
            formData.append('upiId', config.upiId);
            formData.append('instructions', config.instructions);
            if (qrFile) {
                formData.append('qrCode', qrFile);
            } else {
                formData.append('qrCodeUrl', config.qrCodeUrl); // Keep existing URL if no new file
            }

            const updatedConfig = await configAPI.updatePaymentConfig(formData);
            setConfig({
                ...config,
                qrCodeUrl: updatedConfig.qrCodeUrl
            });
            setQrFile(null);
            setMessage('Payment configuration updated successfully!');
        } catch (error) {
            setMessage('Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">UPI ID</label>
                <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50"
                    value={config.upiId}
                    onChange={(e) => setConfig({ ...config, upiId: e.target.value })}
                    placeholder="e.g. business@upi"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">QR Code Image</label>
                <div className="space-y-2">
                    {config.qrCodeUrl && (
                        <div className="mb-2">
                            <p className="text-xs text-gray-500 mb-1">Current QR Code:</p>
                            <img
                                src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${config.qrCodeUrl}`}
                                alt="Current QR"
                                className="w-32 h-32 object-contain bg-white rounded p-2"
                            />
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50"
                    />
                    <p className="text-xs text-gray-500">Upload a new QR code image to replace the current one.</p>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Instructions</label>
                <textarea
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 min-h-[100px]"
                    value={config.instructions}
                    onChange={(e) => setConfig({ ...config, instructions: e.target.value })}
                    placeholder="Payment instructions for users..."
                />
            </div>

            {message && <p className="text-green-400 text-sm">{message}</p>}

            <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Configuration'}
            </Button>
        </form>
    );
};

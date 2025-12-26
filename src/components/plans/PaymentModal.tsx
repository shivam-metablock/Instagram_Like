import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { X, Upload, CheckCircle, Copy } from 'lucide-react';
import { configAPI, orderAPI, walletAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface PaymentModalProps {
    plan?: any;
    isDeposit?: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ plan, isDeposit, onClose, onSuccess }) => {
    const [step, setStep] = useState(1);
    const [config, setConfig] = useState<any>(null);
    const [utr, setUtr] = useState('');
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [video, setVideo] = useState('');
    const [amount, setAmount] = useState(plan?.price?.toString() || '');
    const { user } = useAuth();

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const data = await configAPI.getPaymentConfig();
            setConfig(data);
        } catch (err) {
            console.error('Failed to load payment config');
        }
    };

    const handleCopyUpi = () => {
        if (config?.upiId) {
            navigator.clipboard.writeText(config.upiId);
            // Optional: Show toast
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await processPayment('ONLINE');
    };

    const processPayment = async (method: 'ONLINE' | 'WALLET') => {
        if (method === 'ONLINE' && (!utr || !screenshot)) {
            setError('Please provide both UTR and Screenshot');
            return;
        }
        if (isDeposit && !amount) {
            setError('Please enter an amount');
            return;
        }
        if (!isDeposit && !video) {
            setError('Please provide a Video / Profile URL');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (isDeposit) {
                const formData = new FormData();
                formData.append('amount', amount);
                formData.append('utr', utr);
                formData.append('screenshot', screenshot!);
                await walletAPI.deposit(formData);
            } else if (method === 'WALLET') {
                await orderAPI.create({
                    planId: plan._id,
                    amount: plan.price.toString(),
                    video: video,
                    paymentMethod: 'WALLET'
                });
            } else {
                const formData = new FormData();
                formData.append('planId', plan._id);
                formData.append('amount', plan.price.toString());
                formData.append('utr', utr);
                formData.append('screenshot', screenshot!);
                formData.append('video', video);
                formData.append('paymentMethod', 'ONLINE');

                await orderAPI.create(formData);
            }

            setStep(3); // Success step
            setTimeout(() => {
                onSuccess();
            }, 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Payment submission failed');
            setLoading(false);
        }
    };

    if (!plan && !isDeposit) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <Card className="w-full max-w-md relative animate-in fade-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <X size={24} />
                </button>

                {step === 1 && (
                    <div className="space-y-6 overflow-y-auto max-h-[70vh] p-2 custom-scrollbar">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-white mb-2">{isDeposit ? 'Add Funds' : 'Scan & Pay'}</h3>
                            {!isDeposit ? (
                                <p className="text-gray-400">Amount to Pay: <span className="text-white font-bold text-lg">₹{plan.price}</span></p>
                            ) : (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Deposit Amount (₹)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-center text-xl font-bold focus:outline-none focus:border-purple-500/50"
                                        placeholder="Enter amount"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        {!isDeposit && (
                            <div className="space-y-2 px-2">
                                <label className="block text-sm font-medium text-gray-400">Video / Profile URL</label>
                                <input
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50"
                                    placeholder="Enter your link here"
                                    value={video}
                                    onChange={(e) => setVideo(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        {!isDeposit && (
                            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
                                <p className="text-sm text-gray-400 mb-1">Your Wallet Balance</p>
                                <p className="text-2xl font-bold text-purple-400">₹{user?.walletBalance || 0}</p>
                            </div>
                        )}

                        {!isDeposit && user && user.walletBalance >= plan.price ? (
                            <Button
                                onClick={() => processPayment('WALLET')}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                            >
                                {loading ? 'Processing...' : 'Pay with Wallet'}
                            </Button>
                        ) : (
                            <div className="text-center text-sm text-amber-400 bg-amber-400/10 p-2 rounded-lg">
                                Insufficient balance for wallet payment
                            </div>
                        )}

                        {!isDeposit && (
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-white/10"></span>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-black px-2 text-gray-500">Or Pay Online</span>
                                </div>
                            </div>
                        )}

                        {config ? (
                            <div className="flex flex-col items-center gap-4 p-4 bg-white rounded-xl">
                                {config.qrCodeUrl ? (
                                    <img
                                        src={config.qrCodeUrl.startsWith('http') ? config.qrCodeUrl : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${config.qrCodeUrl}`}
                                        alt="QR Code"
                                        className="w-48 h-48 object-contain"
                                    />
                                ) : (
                                    <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                                        No QR Code
                                    </div>
                                )}
                                <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg w-full justify-between">
                                    <span className="text-black font-mono">{config.upiId || 'No UPI ID'}</span>
                                    <button onClick={handleCopyUpi} className="text-blue-600 hover:text-blue-700">
                                        <Copy size={18} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400">Loading payment details...</div>
                        )}

                        <div className="text-sm text-gray-400 text-center px-4">
                            {config?.instructions || 'Scan the QR code or use the UPI ID to make the payment.'}
                        </div>

                        <Button onClick={() => setStep(2)} variant="outline" className="w-full">
                            I have made the payment
                        </Button>


                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 overflow-y-auto max-h-[70vh] p-2 custom-scrollbar">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-white mb-2">Submit Proof</h3>
                            <p className="text-gray-400">Enter payment details for verification</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">UTR / Transaction ID</label>
                                <input
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                                    placeholder="e.g. 1234567890"
                                    value={utr}
                                    onChange={(e) => setUtr(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Screenshot</label>
                                <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center hover:border-purple-500/50 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                                        required
                                    />
                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                        <Upload size={24} />
                                        <span>{screenshot ? screenshot.name : 'Click to upload screenshot'}</span>
                                    </div>
                                </div>
                            </div>

                            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                            <div className="flex gap-3">
                                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                                    Back
                                </Button>
                                <Button type="submit" disabled={loading} className="flex-1">
                                    {loading ? 'Submitting...' : 'Submit Payment'}
                                </Button>
                            </div>
                        </form>
                    </div>
                )
                }

                {
                    step === 3 && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-4 animate-bounce">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{isDeposit ? 'Deposit Submitted!' : 'Payment Submitted!'}</h3>
                            <p className="text-gray-400">
                                {isDeposit
                                    ? 'We will verify your deposit and update your balance shortly.'
                                    : 'We will verify your payment and activate your plan shortly.'}
                            </p>
                        </div>
                    )}
            </Card>
        </div>
    );
};

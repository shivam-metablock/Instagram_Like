import React, { useState, useEffect } from 'react';
import { Layout } from '../components/ui/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { walletAPI } from '../services/api';
import { Loader2, CheckCircle, XCircle, ExternalLink, User } from 'lucide-react';

export const WalletRequests: React.FC = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const data = await walletAPI.getPending();
            setRequests(data);
        } catch (err) {
            console.error('Failed to fetch pending deposits');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        if (!window.confirm(`Are you sure you want to ${status.toLowerCase()} this deposit?`)) return;

        setProcessing(id);
        try {
            await walletAPI.handleStatus(id, status);
            setRequests(requests.filter(req => req._id !== id));
        } catch (err) {
            alert('Failed to process request');
        } finally {
            setProcessing(null);
        }
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Wallet Deposit Requests</h2>
                        <p className="text-gray-400">Review and approve user balance top-ups</p>
                    </div>
                    <div className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-sm font-bold border border-blue-500/20">
                        {requests.length} Pending
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-blue-500" size={48} />
                    </div>
                ) : requests.length === 0 ? (
                    <Card className="p-20 text-center text-gray-500 bg-slate-800/20 border-dashed border-white/10">
                        <CheckCircle className="mx-auto mb-4 text-gray-600" size={64} />
                        <h3 className="text-xl font-bold text-white">All Caught Up!</h3>
                        <p>No pending wallet deposit requests at the moment.</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {requests.map((request) => (
                            <Card key={request._id} className="bg-slate-800/40 border-white/5 hover:border-white/10 transition-colors">
                                <div className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                                    {/* Screenshot Preview */}
                                    <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-white/10 relative group">
                                        {request.screenshotPath ? (
                                            <>
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${request.screenshotPath}`}
                                                    alt="Proof"
                                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                />
                                                <a
                                                    href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${request.screenshotPath}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-white"
                                                >
                                                    <ExternalLink size={20} />
                                                </a>
                                            </>
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-600 text-xs">No Image</div>
                                        )}
                                    </div>

                                    {/* User and Info */}
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-blue-500/20 rounded-lg text-blue-400">
                                                <User size={16} />
                                            </div>
                                            <h4 className="font-bold text-white text-lg">{request.userId?.name || 'Unknown User'}</h4>
                                            <span className="text-gray-500 text-xs">• {request.userId?.number}</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider">Amount</p>
                                                <p className="text-2xl font-black text-green-400">₹{request.amount}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider">UTR / Transaction ID</p>
                                                <p className="text-sm font-mono text-white">{request.utr || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500">Requested on {new Date(request.createdAt).toLocaleString()}</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
                                        <Button
                                            onClick={() => handleAction(request._id, 'APPROVED')}
                                            disabled={!!processing}
                                            className="flex-1 bg-green-600 hover:bg-green-500 text-white gap-2"
                                        >
                                            {processing === request._id ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                                            Approve
                                        </Button>
                                        <Button
                                            onClick={() => handleAction(request._id, 'REJECTED')}
                                            disabled={!!processing}
                                            variant="outline"
                                            className="flex-1 border-red-500/50 text-red-500 hover:bg-red-500/10 gap-2"
                                        >
                                            <XCircle size={18} />
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

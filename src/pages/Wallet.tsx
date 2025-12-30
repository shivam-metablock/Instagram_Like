import React, { useState, useEffect } from 'react';
import { Layout } from '../components/ui/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
// import { walletAPI } from '../services/api';
import { Wallet as WalletIcon, Plus, History, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PaymentModal } from '../components/plans/PaymentModal';
import { walletAPI, orderAPI } from '../services/api';

export const Wallet: React.FC = () => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const [txData, orderData] = await Promise.all([
                walletAPI.getTransactions(),
                orderAPI.getMyOrders()
            ]);

            // Transform wallet transactions
            const walletTx = txData.map((tx: any) => ({
                ...tx,
                displayType: tx.type === 'DEPOSIT' ? 'QR' : 'WALLET'
            }));

            // Transform orders into transaction-like objects
            // Only include non-wallet orders to avoid duplicates (wallet orders create a 'PURCHASE' transaction already)
            const manualOrders = orderData
                .filter((order: any) => order.utr !== 'WALLET_PAYMENT')
                .map((order: any) => ({
                    _id: order._id,
                    displayType: 'QR',
                    amount: order.amount,
                    status: order.status,
                    description: `Plan Purchase: ${order.planId?.name || 'Manual Order'}`,
                    createdAt: order.createdAt,
                    type: 'MANUAL_PURCHASE' // Keep internal type for color logic
                }));

            const combined = [...walletTx, ...manualOrders].sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            setTransactions(combined);
        } catch (err) {
            console.error('Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    };


    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Balance Card */}
                <div className="grid place-items-center  sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <Card className="bg-slate-800/50 w-[80%] sm:w-full border-white/10 flex flex-col justify-center sm:p-8 p-2 text-center space-y-4">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="p-3 bg-white/10 rounded-2xl">
                                    <WalletIcon className="text-white" size={20} />
                                </div>
                                <span className="text-white/60 text-sm font-medium"> Wallet</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-white/60 text-sm uppercase tracking-wider">Available Balance</p>
                                <h2 className="sm:text-5xl text-xl font-black text-white">₹{user?.walletBalance || 0}</h2>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-slate-800/50 w-[80%] sm:w-full border-white/10 sm:p-8 p-2 flex flex-col justify-center p-8 text-center space-y-4">
                        <div className="p-4 bg-blue-500/10 rounded-full w-16 h-16 mx-auto flex items-center justify-center text-blue-400">
                            <Plus size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Add Funds</h3>
                            <p className="text-gray-400 text-sm">Top up your wallet to purchase plans instantly</p>
                        </div>
                        <Button
                            onClick={() => setShowDepositModal(true)}
                            className="w-full  bg-blue-600 hover:bg-blue-500"
                        >
                            Deposit Money
                        </Button>
                    </Card>
                </div>

                {message.text && (
                    <div className={cn(
                        "p-4 rounded-xl text-center border animate-in slide-in-from-top-4",
                        message.type === 'success' ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                    )}>
                        {message.text}
                    </div>
                )}

                {/* Transactions Table */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white font-bold text-xl">
                        <History size={24} className="text-blue-400" />
                        <span>Transaction History</span>
                    </div>

                    <Card className="overflow-hidden border-white/10 bg-slate-800/30">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">Description</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                <Loader2 className="animate-spin inline mr-2" /> Loading history...
                                            </td>
                                        </tr>
                                    ) : transactions.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                No transactions yet
                                            </td>
                                        </tr>
                                    ) : (
                                        transactions.map((tx) => (
                                            <tr key={tx._id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className={cn(
                                                        "text-xs font-bold px-2.5 py-1 rounded-full",
                                                        tx.displayType === 'QR' ? "bg-blue-500/10 text-blue-400" :
                                                            "bg-purple-500/10 text-purple-400"
                                                    )}>
                                                        {tx.displayType}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-white text-sm">{tx.description}</td>
                                                <td className={cn(
                                                    "px-6 py-4 font-bold",
                                                    tx.type === 'DEPOSIT' ? "text-green-400" : "text-red-400"
                                                )}>
                                                    {tx.type === 'DEPOSIT' ? '+' : '-'}₹{tx.amount}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={cn(
                                                        "text-xs",
                                                        tx.status === 'APPROVED' ? "text-green-400" :
                                                            tx.status === 'PENDING' ? "text-amber-400" : "text-red-400"
                                                    )}>
                                                        {tx.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-400 text-sm">
                                                    {new Date(tx.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Deposit Modal */}
                {showDepositModal && (
                    <PaymentModal
                        isDeposit={true}
                        onClose={() => setShowDepositModal(false)}
                        onSuccess={() => {
                            setShowDepositModal(false);
                            fetchTransactions();
                            setMessage({ type: 'success', text: 'Deposit request submitted successfully!' });
                        }}
                    />
                )}
            </div>
        </Layout>
    );
};

// Helper for class names
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

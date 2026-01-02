import { Layout } from "../components/ui/Layout";
import { Card } from "../components/ui/Card";
import { History, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { cn } from "../utils/cn";
import { orderAPI } from "../services/api";
import type { Order } from "./SeeUserView";

export const HistoryFunction: React.FC = () => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
 const orders: Order[] = await orderAPI.getAll();

            const userOrdersMap: { [key: string]: Order[] } = {};
            orders.forEach((order: Order) => {
                // Backend returns populated 'userId' field, or just ID if not populated
                if (!order.userId) return; // Skip if no user attached

                const userId = typeof order.userId === 'string' ? order.userId : order.userId._id;
                if (!userOrdersMap[userId]) {
                    userOrdersMap[userId] = [];
                }
                userOrdersMap[userId].push(order);
            });
            //@ts-ignore

            setTransactions(userOrdersMap[user?._id] || []);
        } catch (err) {
            console.error('Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    };
    console.log(transactions);
    
    return (
        <Layout>
               <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white font-bold text-xl">
                        <History size={24} className="text-blue-400" />
                        <span>Order History</span>
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
                                                        {tx._id}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-white text-sm">{tx.planId?.name}</td>
                                                <td className={cn(
                                                    "px-6 py-4 font-bold",
                                                    tx.type === 'DEPOSIT' ? "text-green-400" : "text-red-400"
                                                )}>
                                                    {tx.type === 'DEPOSIT' ? '+' : '-'}₹{tx.amount}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={cn(
                                                        "text-xs text-white",
                                                        tx.compeletedStatus.toUpperCase() === 'COMPLETED' ? "bg-green-500/10 text-green-400" :
                                                            tx.compeletedStatus.toUpperCase() === 'PENDING' ? "bg-yellow-500/10 text-yellow-400" :
                                                                tx.compeletedStatus.toUpperCase() === 'CENCELED' ? "bg-red-500/10 text-red-400" : "bg-red-500/10 text-pink-400"
                                                     
                                                    )}>
                                                        {tx.compeletedStatus}
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
                </div> </Layout>
    );
};
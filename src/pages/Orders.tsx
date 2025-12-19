import React, { useEffect, useState } from "react"
import { Card } from "../components/ui/Card"
import { Layout } from "../components/ui/Layout"
import { Check, ImageIcon, X } from "lucide-react"
import { Button } from "../components/ui/Button"
import { orderAPI } from "../services/api"
import { RejectionModal } from "../components/admin/RejectionModal"
import { getTypeColor } from "../utils/color"

export const Orders = () => {
    const [pendingOrders, setOrders] = useState<any[]>([])
    const [CopyOrders, setCopyOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(false);

    const [rejectingOrder, setRejectingOrder] = useState<string | null>(null);


    useEffect(() => {
        fetchData()
    }, [])
    const fetchData = async () => {
        try {
            const ordersData = await orderAPI.getAll()
            setOrders(ordersData);
            setCopyOrders(ordersData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    const [viewingProof, setViewingProof] = useState<string | null>(null);
    const handleApprove = async (orderId: string) => {
        if (!confirm('Are you sure you want to approve this order?')) return;
        setLoading(true);
        try {
            await orderAPI.updateStatus(orderId, 'APPROVED');
          await  fetchData()

        } catch (error) {
            alert('Failed to approve order');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (reason: string) => {
        if (!rejectingOrder) return;
        setLoading(true);
        try {
            await orderAPI.updateStatus(rejectingOrder, 'REJECTED', reason);
            setRejectingOrder(null);
            await fetchData();
        } catch (error) {
            alert('Failed to reject order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>

            {pendingOrders.length > 0 && (
                <Card className="border-yellow-500/30">
                   <div className=" flex items-center justify-between">
                     <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">Orders
                    </h3>
                   <div className="flex items-center gap-2">
                 <select
                            
                                onChange={(e) =>e.target.value==""?setOrders(CopyOrders):setOrders(CopyOrders.filter((order) => String(order.status) === e.target.value)) }
                                className="bg-slate-800 text-white text-xs border border-white/10 rounded px-2 py-1 focus:outline-none focus:border-purple-500"
                            >
                                <option value="">All</option>
                                <option value="PENDING">Pending</option>
                                <option value="APPROVED">Approved</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                   </div>
                      </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-xs uppercase text-gray-400">
                                <tr>
                                    <th className="px-4 py-3">User</th>
                                    <th className="px-4 py-3">Plan</th>
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3">UTR</th>
                                    <th className="px-4 py-3">Proof</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-center">Video</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {pendingOrders.map((order) => (
                                    <React.Fragment key={order._id}>
                                        <tr className="hover:bg-white/5">
                                            <td className="px-4 py-3 text-white">{order.userId?.name || 'Unknown'}</td>
                                            <td className="px-4 py-3 text-gray-400">{order.planId?.name || 'N/A'}</td>
                                            <td className="px-4 py-3 text-white font-bold">₹{order.amount}</td>
                                            <td className="px-4 py-3 font-mono text-xs text-yellow-400">{order.utr || '-'}</td>
                                            <td className="px-4 py-3">
                                                {order.screenshotPath ? (
                                                    <button
                                                        onClick={() => setViewingProof(order.screenshotPath)}
                                                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs"
                                                    >
                                                        <ImageIcon size={14} /> View
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-500 text-xs">No Proof</span>
                                                )}
                                            </td>
                                            <td className={`px-4 py-3 text-white `}><div className={`${getTypeColor(order.status)} text-center py-1 px-2 rounded-full`}>{order.status || 'Unknown'}</div></td>
                                            <td className="px-4 py-3 text-white">{order.video || 'Unknown'}</td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                  {order.status=="PENDING"&&
                                                    <>
                                                      <Button
                                                        onClick={() => handleApprove(order._id)}
                                                        className="bg-green-600 hover:bg-green-500 h-8 px-3 py-1 flex items-center justify-center"
                                                        disabled={loading}
                                                    >
                                                        <Check size={14} />
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => setRejectingOrder(order._id)}
                                                        className="h-8 px-3 py-1 flex items-center justify-center"
                                                        disabled={loading}
                                                    >
                                                        <X size={14} />
                                                    </Button>
                                                    </>
                                                  }
                                                </div>
                                            </td>

                                        </tr>

                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
            {viewingProof && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setViewingProof(null)}>
                    <div className="relative max-w-4xl max-h-[90vh] overflow-auto">
                        <img
                            src={`${import.meta.env.VITE_API_URL}/${viewingProof}`}
                            alt="Payment Proof"
                            className="w-full h-auto rounded-lg"
                        />
                        <button className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/70">
                            <X size={24} />
                        </button>
                    </div>
                </div>
            )}
            {rejectingOrder && (
                <RejectionModal
                    onClose={() => setRejectingOrder(null)}
                    onSubmit={handleReject}
                />
            )}
        </Layout>
    )
}
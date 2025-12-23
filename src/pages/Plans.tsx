import React, { useState, useEffect } from 'react';
import { Layout } from '../components/ui/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { planAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Check, Zap, Star } from 'lucide-react';
import { PaymentModal } from '../components/plans/PaymentModal';
import { useSearchParams } from 'react-router-dom';
import { getTypeColor } from '../utils/color';

interface Plan {
    _id: string;
    name: string;
    description: string;
    price: number;
    
    features: string[];
    type: string;
    platform: string;
}

export const Plans: React.FC = () => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [message, setMessage] = useState('');
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const platformFilter = searchParams.get('platform');

    // Separate VIEWS plans from other service plans
    const reachPlans = plans.filter(p => p.type === 'VIEWS');
    const servicePlans = plans.filter(p => p.type !== 'VIEWS');

    useEffect(() => {
        fetchPlans();
    }, [platformFilter]); // Re-fetch when platform changes

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const data = await planAPI.getAll(platformFilter || undefined);
            setPlans(data);
        } catch (error) {
            console.error('Error fetching plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePurchaseClick = (plan: Plan) => {
        if (!user) {
            setMessage('Please login to purchase');
            return;
        }
        setSelectedPlan(plan);
    };

    const handlePaymentSuccess = () => {
        setSelectedPlan(null);
        setMessage('✅ Order submitted successfully! Pending admin approval.');
        setTimeout(() => {
            setMessage('');
            // Optional: Redirect to dashboard or orders page
            window.location.href = '/dashboard';
        }, 3000);
    };

  

    return (
        <Layout>
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Reach Boost Plans Section */}
                <div>
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/20 rounded-full text-pink-400 text-sm font-medium mb-4">
                            <Zap size={16} /> Most Popular
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-3">
                            {platformFilter ? `${platformFilter} ` : ''} Reach Boost Plans
                        </h2>
                        <p className="text-gray-400 text-lg">
                            {platformFilter
                                ? `Showing plans for ${platformFilter.toLowerCase()}`
                                : 'Choose a package and start skyrocketing your reach'}
                        </p>
                        {platformFilter && (
                            <div className="mt-4 inline-block p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-sm">
                                💡 Showing all plans (set platform in "Create Plans" to filter)
                            </div>
                        )}
                    </div>

                    {message && (
                        <div className={`p-4 rounded-lg text-center mb-6 ${message.includes('✅')
                            ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                            : 'bg-red-500/10 border border-red-500/20 text-red-400'
                            }`}>
                            {message}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center text-gray-400">Loading plans...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {reachPlans.map((plan, idx) => (
                                <Card
                                    key={plan._id}
                                    className={`flex flex-col h-full relative overflow-hidden ${idx === 1 ? 'border-2 border-pink-500 scale-105 shadow-2xl shadow-pink-500/20' : ''
                                        }`}
                                >
                                    {idx === 1 && (
                                        <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 text-xs font-bold rounded-bl-lg">
                                            <Star size={12} className="inline mr-1" /> POPULAR
                                        </div>
                                    )}

                                    <div className="p-6 flex flex-col h-full">
                                        <div className="text-center mb-6">
                                            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${getTypeColor(plan.type)} text-white`}>
                                                {plan.type}
                                            </div>
                                            <div className="text-5xl font-bold text-white mb-2">₹{plan.price}</div>
                                            <div className="text-gray-400 text-sm">one-time payment</div>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-3 text-center">{plan.name}</h3>
                                        <p className="text-gray-400 text-sm mb-6 text-center flex-1">{plan.description}</p>

                                        <div className="space-y-3 mb-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(plan.platform)}`}>
                                            {plan.platform}
                                        </span>
                                            {plan.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                                                    <Check size={16} className="text-green-400 flex-shrink-0" />
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        
                                        </div>

                                        <Button
                                            onClick={() => handlePurchaseClick(plan)}
                                            className={`w-full ${idx === 1 ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500' : ''}`}
                                        >
                                            Purchase Now
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Service Plans Section */}
                {servicePlans.length > 0 && (
                    <div>
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">Additional Services</h2>
                            <p className="text-gray-400">Legal promotional services to grow your account</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {servicePlans.map((plan) => (
                                <Card key={plan._id} className="flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(plan.type)}`}>
                                            {plan.type}
                                        </span>
                                         <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white`}>
                                             {plan.platform}
                                            </div>
                                    
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-white">₹{plan.price}</div>
                                            <div className="text-xs text-gray-400">one-time</div>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                    <p className="text-gray-400 text-sm mb-4 flex-1">{plan.description}</p>

                                    <div className="space-y-2 mb-6">
                                        {plan.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                                                <Check size={16} className="text-green-400" />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        onClick={() => handlePurchaseClick(plan)}
                                       
                                        className={`w-full from-purple-500 hover:to-pink-500`}
                                      
                                    >
                                        Purchase Now
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

           
                {/* Payment Modal */}
                {selectedPlan && (
                    <PaymentModal
                        plan={selectedPlan}
                        onClose={() => setSelectedPlan(null)}
                        onSuccess={handlePaymentSuccess}
                    />
                )}
            </div>
        </Layout>
    );
};

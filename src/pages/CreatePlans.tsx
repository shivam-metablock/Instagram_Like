import React, { useState, useEffect } from 'react';
import { Layout } from '../components/ui/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { planAPI } from '../services/api';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Plan {
    _id: string;
    name: string;
    description: string;
    price: number;
    features: string[];
    type: string;
    platform?: string;
    viewsCount?: number;
    likesCount?: number;
    followersCount?: number;
}

export const CreatePlans: React.FC = () => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [showAddPlan, setShowAddPlan] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        features: [''],
        type: 'VIEWS',
        platform: 'INSTAGRAM',
        viewsCount: 0,
        likesCount: 0,
        followersCount: 0,
    });

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const data = await planAPI.getAll();
            setPlans(data);
        } catch (error) {
            console.error('Error fetching plans:', error);
        }
    };

    const handlePlanSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const planData = formData.type === 'VIEWS'
                ? formData
                : { ...formData, viewsCount: undefined };

            console.log("form Data", formData);

            if (editingPlan) {
                await planAPI.update(editingPlan._id, planData);
            } else {
                await planAPI.create(planData);
            }
            fetchPlans();
            resetPlanForm();
        } catch (error) {
            console.error('Error saving plan:', error);
        }
    };

    const handlePlanEdit = (plan: Plan) => {
        setFormData({
            name: plan.name,
            description: plan.description,
            price: plan.price,
            features: plan.features,
            type: plan.type,
            platform: plan.platform || 'INSTAGRAM',
            viewsCount: plan.viewsCount || 0,
            likesCount: plan.likesCount || 0,
            followersCount: plan.followersCount || 0,
        });
        setEditingPlan(plan);
        setShowAddPlan(true);
    };

    const handlePlanDelete = async (id: string) => {
        if (confirm('Delete this plan?')) {
            try {
                await planAPI.delete(id);
                fetchPlans();
            } catch (error) {
                console.error('Error deleting plan:', error);
            }
        }
    };

    const resetPlanForm = () => {
        setFormData({ name: '', description: '', price: 0, features: [''], type: 'VIEWS', platform: 'INSTAGRAM', viewsCount: 0, likesCount: 0, followersCount: 0 });
        setEditingPlan(null);
        setShowAddPlan(false);
    };

    const addPlanFeature = () => {
        setFormData({ ...formData, features: [...formData.features, ''] });
    };

    const removePlanFeature = (index: number) => {
        setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
    };

    const updatePlanFeature = (index: number, value: string) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData({ ...formData, features: newFeatures });
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto space-y-8">
                <h2 className="text-3xl font-bold text-white">Create Plans</h2>

                <Card>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white">Manage Plans</h3>
                        <Button onClick={() => setShowAddPlan(!showAddPlan)} className="flex items-center gap-2">
                            <Plus size={20} /> {showAddPlan ? 'Cancel' : 'Create New Plan'}
                        </Button>
                    </div>

                    {showAddPlan && (
                        <form onSubmit={handlePlanSubmit} className="mb-6 p-6 bg-white/5 rounded-lg space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Plan Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg  px-4 py-2 text-white"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g., Premium  Package"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Price (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Plan Type</label>
                                    <select
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-black"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="VIEWS">Views Boost</option>
                                        <option value="LIKES">Likes Boost</option>
                                        <option value="FOLLOWERS">Followers Boost</option>
                                        <option value="BUNDLE">Bundle(like+followers+views)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Platform</label>
                                    <select
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-black"
                                        value={formData.platform}
                                        onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                    >
                                        <option value="INSTAGRAM">Instagram</option>
                                        <option value="FACEBOOK">Facebook</option>
                                        <option value="YOUTUBE">YouTube</option>
                                        <option value="TELEGRAM">Telegram</option>
                                    </select>
                                </div>
                                {formData.type === 'VIEWS' || formData.type === 'BUNDLE' ? (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Reach Count</label>
                                            <input
                                                type="number"
                                                min="0"
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                                                value={formData.viewsCount}
                                                onChange={(e) => setFormData({ ...formData, viewsCount: Number(e.target.value) })}
                                                placeholder="e.g., 10000"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Likes Count</label>
                                            <input
                                                type="number"
                                                min="0"
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                                                value={formData.likesCount}
                                                onChange={(e) => setFormData({ ...formData, likesCount: Number(e.target.value) })}
                                                placeholder="e.g., 500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Followers Count</label>
                                            <input
                                                type="number"
                                                min="0"
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                                                value={formData.followersCount}
                                                onChange={(e) => setFormData({ ...formData, followersCount: Number(e.target.value) })}
                                                placeholder="e.g., 100"
                                            />
                                        </div>
                                    </>
                                ) : null}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe what this plan offers..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Features</label>
                                {formData.features.map((feature, idx) => (
                                    <div key={idx} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                                            value={feature}
                                            onChange={(e) => updatePlanFeature(idx, e.target.value)}
                                            placeholder={`Feature ${idx + 1}`}
                                        />
                                        {formData.features.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="danger"
                                                onClick={() => removePlanFeature(idx)}
                                                className="px-3"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={addPlanFeature} className="mt-2">
                                    + Add Feature
                                </Button>
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button type="submit">{editingPlan ? 'Update Plan' : 'Create Plan'}</Button>
                                <Button type="button" variant="outline" onClick={resetPlanForm}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* Plans List */}
                    <div className="space-y-3">
                        {plans.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">No plans created yet</div>
                        ) : (
                            plans.map((plan) => (
                                <div key={plan._id} className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="text-white font-medium text-lg">{plan.name}</h4>
                                                <Badge variant={plan.type === 'VIEWS' ? 'success' : 'default'}>
                                                    {plan.type}
                                                </Badge>
                                                <Badge variant={plan.platform === 'INSTAGRAM' ? 'default' : plan.platform === 'FACEBOOK' ? 'default' : plan.platform === 'YOUTUBE' ? 'danger' : 'default'}>
                                                    {plan.platform || 'INSTAGRAM'}
                                                </Badge>
                                                <div className="text-white font-bold">₹{plan.price}</div>
                                                {plan.viewsCount ? <span className="text-sm text-blue-400">({plan.viewsCount.toLocaleString()} Reach)</span> : null}
                                                {plan.likesCount ? <span className="text-sm text-pink-400">({plan.likesCount.toLocaleString()} Likes)</span> : null}
                                                {plan.followersCount ? <span className="text-sm text-purple-400">({plan.followersCount.toLocaleString()} Follows)</span> : null}
                                            </div>
                                            <p className="text-sm text-gray-400 mb-2">{plan.description}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {plan.features.map((feature, idx) => (
                                                    <span key={idx} className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                                                        ✓ {feature}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <button
                                                onClick={() => handlePlanEdit(plan)}
                                                className="text-blue-400 hover:text-blue-300 p-2"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handlePlanDelete(plan._id)}
                                                className="text-red-400 hover:text-red-300 p-2"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

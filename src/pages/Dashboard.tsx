import React from 'react';
import { Layout } from '../components/ui/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MyPlans } from './MyPlans';

export const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();


    const isAdmin = user?.role === 'ADMIN';

    if (isAdmin) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold text-white">Admin Dashboard</h2>
                        <Button onClick={() => navigate('/admin')} variant="outline">
                            Go to Admin Panel
                        </Button>
                    </div>
                    <Card className="p-8 text-center border-purple-500/30 bg-purple-500/10">
                        <p className="text-gray-300 text-lg">
                            Admin users do not have access to Reach Boost simulation.
                            <br />
                            <br />
                            Please use the <strong className="text-white">Admin Panel</strong> to manage plans, proxies, and view analytics.
                        </p>
                    </Card>
                </div>
            </Layout>
        );
    }


    // Render user view
    return (
        <Layout>
            <div className="max-w-6xl mx-auto space-y-8">
                <MyPlans />
            </div>
        </Layout>
    );
};

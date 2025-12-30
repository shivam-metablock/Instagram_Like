import React, { useEffect, useState } from 'react';
import { Layout } from '../components/ui/Layout';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { User, CreditCard, HelpCircle } from 'lucide-react';
import { PaymentConfigForm } from '../components/settings/PaymentConfigForm';
import { Button } from '../components/ui/Button';
import { configAPI } from '../services/api';

export const Settings: React.FC = () => {
    const { user, updateMe } = useAuth();

    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        number: user?.number || '',
        currentPassword:  ""
    });
    const [message, setMessage] = useState("")


    const handleProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        updateMe(profileData)
    };
    useEffect(() => {
        setProfileData({
            name: user?.name || '',
            number: user?.number || '',
            currentPassword:  ""
        })
    }, [user])
    //@ts-ignore
    const [helpCenter, setHelpCenter] = useState(user?.helpCenter[0]?.title || "")
    const AddHelp = async () => {
        try {
            await configAPI.addHelpCenter({ title:helpCenter })
            setMessage("Help Center Added Successfully")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h2 className="text-3xl font-bold text-white">Settings</h2>
                    <p className="text-gray-400 mt-1">Manage your account and preferences</p>
                </div>

                {/* Profile Settings */}
                <Card>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                            <User size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-white">Profile Information</h3>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                            <input
                                type="text"

                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                                value={profileData.name}
                                onChange={(e) => setProfileData({
                                    ...profileData,
                                    name: e.target.value
                                })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                            <input
                                type="number"

                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                                value={profileData.number}
                                onChange={(e) => setProfileData({
                                    ...profileData,
                                    number: e.target.value
                                })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">User Role</label>
                            <div className="px-4 py-3 bg-white/5 rounded-lg text-gray-400 border border-white/10">
                                {user?.role || 'USER'}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                            <input
                                type="password"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                                value={profileData.currentPassword}
                                onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                            />
                        </div>
                        <Button type="submit">Save Changes</Button>
                    </form>
                </Card>

                {/* Security Settings */}
                {/* <Card>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-500/20 rounded-lg text-red-400">
                            <Lock size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-white">Security</h3>
                    </div>

                    <form onSubmit={handlePasswordChange} className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
                            <input
                                type="password"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                                value={profileData.currentPassword}
                                onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                            />
                        </div>
                      
                      
                        <Button type="submit" variant="danger">Change Password</Button>
                    </form>
                </Card> */}

                {/* Notification Settings */}
                {/* <Card>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                            <Bell size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-white">Notifications</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <Bell size={20} className="text-gray-400" />
                                <div>
                                    <div className="text-white font-medium">Push Notifications</div>
                                    <div className="text-sm text-gray-400">Receive simulation updates</div>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={notificationsEnabled}
                                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                                <Mail size={20} className="text-gray-400" />
                                <div>
                                    <div className="text-white font-medium">Email Alerts</div>
                                    <div className="text-sm text-gray-400">Get order and plan updates via email</div>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={emailAlerts}
                                    onChange={(e) => setEmailAlerts(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </Card> */}

                {/* Billing Info */}
                {/* <Card>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                            <CreditCard size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-white">Billing Information</h3>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                                <div className="text-white font-medium">Payment Method</div>
                                <div className="text-sm text-gray-400">No payment method added</div>
                            </div>
                            <Button variant="outline" className="text-sm">Add Card</Button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                                <div className="text-white font-medium">Billing History</div>
                                <div className="text-sm text-gray-400">View all transactions</div>
                            </div>
                            <Button variant="outline" className="text-sm">View History</Button>
                        </div>
                    </div>
                </Card> */}

                {/* Admin Payment Configuration */}
                {user?.role === 'ADMIN' && (
                    <>
                        <Card>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400">
                                    <CreditCard size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-white">Payment Configuration</h3>
                            </div>

                            <PaymentConfigForm />
                        </Card>
                        <Card>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400">
                                    <HelpCircle size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-white">Help Center</h3>
                            </div>

                            <input type="text" onChange={(e) => setHelpCenter(e.target.value)} value={helpCenter} className="w-full p-2 border border-gray-600 bg-transparent text-white rounded-lg" />
                            <Button variant="outline" className="text-sm" onClick={() => AddHelp()}>Add Question</Button>
                            {message && <p className="text-sm text-green-500 mt-2">{message}</p>}
                        </Card>
                    </>
                )}

                {/* Danger Zone */}
                {/* <Card className="border-red-500/20">
                    <h3 className="text-xl font-bold text-red-400 mb-4">Danger Zone</h3>
                    <div className="space-y-3">
                        <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-white font-medium">Delete Account</div>
                                    <div className="text-sm text-gray-400">Permanently delete your account and all data</div>
                                </div>
                                <Button variant="danger" className="text-sm">Delete Account</Button>
                            </div>
                        </div>
                    </div>
                </Card> */}
            </div>
        </Layout>
    );
};

import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

const MOCK_PROXIES = [
    { ip: "192.168.1.101", port: "8080", country: "US", status: "Active" },
    { ip: "10.0.0.45", port: "3128", country: "DE", status: "Rotating" },
    { ip: "172.16.0.22", port: "8888", country: "FR", status: "Idle" },
    { ip: "192.168.1.105", port: "8080", country: "US", status: "Active" },
    { ip: "10.0.0.50", port: "3128", country: "CA", status: "Rotating" },
];

export const ProxyTable: React.FC = () => {
    return (
        <Card className="w-full overflow-hidden">
            <h3 className="text-lg font-semibold mb-4 text-white">Proxy Engine Status</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-white/5 text-xs uppercase">
                        <tr>
                            <th className="px-4 py-3">IP Address</th>
                            <th className="px-4 py-3">Port</th>
                            <th className="px-4 py-3">Country</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {MOCK_PROXIES.map((proxy, idx) => (
                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                                <td className="px-4 py-3 font-mono">{proxy.ip}</td>
                                <td className="px-4 py-3">{proxy.port}</td>
                                <td className="px-4 py-3">{proxy.country}</td>
                                <td className="px-4 py-3">
                                    <Badge variant={proxy.status as any}>{proxy.status}</Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

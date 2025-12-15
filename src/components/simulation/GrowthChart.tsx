import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card } from '../ui/Card';

interface GrowthChartProps {
    data: { time: string; views: number }[];
}

export const GrowthChart: React.FC<GrowthChartProps> = ({ data }) => {
    return (
        <Card className="h-[300px] w-full">
            <h3 className="text-lg font-semibold mb-4 text-white">Live Growth</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tick={{ fill: '#9ca3af' }} />
                    <YAxis stroke="#9ca3af" fontSize={12} tick={{ fill: '#9ca3af' }} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="views"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6, fill: '#60a5fa' }}
                        animationDuration={300}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
};

import { useState, useEffect, useRef } from 'react';

export interface SimulationState {
    views: number;
    likes: number;
    followers: number;
    ctr: number;
    proxiesUsed: number;
    isRunning: boolean;
    chartData: { time: string; views: number }[];
}

export const useSimulation = (initialViews = 0, limits: { views?: number; likes?: number; followers?: number } = {}) => {
    const [state, setState] = useState<SimulationState>({
        views: initialViews,
        likes: Math.floor(initialViews * 0.05),
        followers: 0,
        ctr: 4.5,
        proxiesUsed: 0,
        isRunning: false,
        chartData: [],
    });

    const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const startSimulation = () => {
        if (state.isRunning) return;
        setState(prev => ({ ...prev, isRunning: true }));

        intervalRef.current = setInterval(() => {
            setState(prev => {
                // Determine growth based on limits
                // IF limit exists (>0) AND current >= limit, then growth = 0
                const canGrowViews = !limits.views || prev.views < limits.views;
                const canGrowLikes = !limits.likes || prev.likes < limits.likes;
                const canGrowFollowers = !limits.followers || prev.followers < limits.followers;

                // If all limits reached, stop simulation (optional, or just stop growing)
                // Let's just stop growing specific metrics

                const newViews = canGrowViews ? prev.views + Math.floor(Math.random() * 10) + 1 : prev.views;
                // Ensure we don't exceed limit
                const finalViews = limits.views && newViews > limits.views ? limits.views : newViews;

                const newLikes = canGrowLikes ? prev.likes + (Math.random() > 0.7 ? 1 : 0) : prev.likes;
                const finalLikes = limits.likes && newLikes > limits.likes ? limits.likes : newLikes;

                const newFollowers = canGrowFollowers ? prev.followers + (Math.random() > 0.9 ? 1 : 0) : prev.followers; // Slow follower growth
                const finalFollowers = limits.followers && newFollowers > limits.followers ? limits.followers : newFollowers;

                const newChartData = [...prev.chartData, {
                    time: new Date().toLocaleTimeString(),
                    views: finalViews
                }].slice(-20); // Keep last 20 points

                return {
                    ...prev,
                    views: finalViews,
                    likes: finalLikes,
                    followers: finalFollowers,
                    proxiesUsed: Math.min(prev.proxiesUsed + 1, 50),
                    ctr: finalViews > 0 ? Number(((finalLikes / finalViews) * 100).toFixed(2)) : 0,
                    chartData: newChartData
                };
            });
        }, 1000);
    };

    const stopSimulation = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        setState(prev => ({ ...prev, isRunning: false }));
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return { state, startSimulation, stopSimulation };
};

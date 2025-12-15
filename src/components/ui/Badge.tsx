import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'Active' | 'Rotating' | 'Idle' | 'success' | 'warning' | 'danger' | 'default';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'Idle' }) => {
    const styles = {
        Active: "bg-green-500/20 text-green-400 border-green-500/30",
        Rotating: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        Idle: "bg-gray-500/20 text-gray-400 border-gray-500/30",
        success: "bg-green-500/20 text-green-400 border-green-500/30",
        warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        danger: "bg-red-500/20 text-red-400 border-red-500/30",
        default: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    };

    return (
        <span className={cn("px-2 py-1 rounded-full text-xs font-medium border", styles[variant])}>
            {children}
        </span>
    );
};

import React from 'react';
import { cn } from '../../utils/cn'; // We need to create this utility

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
    return (
        <div
            className={cn("glass-panel rounded-xl p-6 transition-all hover:bg-white/10", className)}
            {...props}
        >
            {children}
        </div>
    );
};

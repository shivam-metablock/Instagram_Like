import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'danger' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ className, variant = 'primary', ...props }) => {
    const variants = {
        primary: "neo-btn text-white",
        danger: "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:shadow-[0_0_25px_rgba(220,38,38,0.7)]",
        outline: "bg-transparent border border-white/20 hover:bg-white/5 text-white shadow-none",
    };

    return (
        <button
            className={cn("px-6 py-3 rounded-lg font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed", variants[variant], className)}
            {...props}
        />
    );
};

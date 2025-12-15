import { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface LiveCounterProps {
    value: number;
    label: string;
    color?: string;
}

export const LiveCounter: React.FC<LiveCounterProps> = ({ value, label, color = "text-white" }) => {
    const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
    const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

    useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    return (
        <div className="flex flex-col items-center">
            <motion.span className={`text-4xl font-bold ${color}`}>
                {display}
            </motion.span>
            <span className="text-sm text-gray-400 uppercase tracking-wider mt-1">{label}</span>
        </div>
    );
};

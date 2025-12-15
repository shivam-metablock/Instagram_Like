import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { X } from 'lucide-react';

interface RejectionModalProps {
    onClose: () => void;
    onSubmit: (reason: string) => void;
}

export const RejectionModal: React.FC<RejectionModalProps> = ({ onClose, onSubmit }) => {
    const [reason, setReason] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(reason);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <Card className="w-full max-w-sm relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <X size={24} />
                </button>

                <h3 className="text-xl font-bold text-white mb-4">Reject Order</h3>
                <form onSubmit={handleSubmit}>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Reason for Rejection</label>
                    <textarea
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500/50 min-h-[100px] mb-4"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="e.g. Payment not received, Invalid UTR..."
                        required
                    />
                    <div className="flex gap-3">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                        <Button type="submit" variant="danger" className="flex-1">Reject Order</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
